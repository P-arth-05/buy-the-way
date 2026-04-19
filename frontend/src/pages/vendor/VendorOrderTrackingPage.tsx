import { useEffect, useState } from "react";
import { useVendor } from "@/contexts/VendorContext";
import { Button } from "@/components/ui/button";

interface ApiResponse<T> {
  message: string;
  data: T;
}

type OrderTrackingStatus =
  | "CREATED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

interface VendorOrder {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: OrderTrackingStatus;
  createdAt: string;
  productName: string;
}

const API_BASE_URL =
  (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__ ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const buildApiBaseCandidates = () => {
  const candidates = [
    API_BASE_URL,
    window.location.origin,
    "http://localhost:8080",
    "http://localhost:8081",
  ].filter(Boolean);

  return [...new Set(candidates)];
};

const requestFromApiCandidates = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const apiBaseCandidates = buildApiBaseCandidates();
  let lastError = "Failed to fetch from all API URLs.";

  for (const apiBase of apiBaseCandidates) {
    try {
      const response = await fetch(`${apiBase}${path}`, init);

      if (!response.ok) {
        const responseText = await response.text();
        lastError = responseText || `Request failed from ${apiBase} (${response.status})`;
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        lastError = `Non-JSON response from ${apiBase}`;
        continue;
      }

      return (await response.json()) as T;
    } catch {
      lastError = `Network error while connecting to ${apiBase}`;
    }
  }

  throw new Error(lastError);
};

const formatTrackingStatus = (status: OrderTrackingStatus) => status.replaceAll("_", " ");

const VendorOrderTrackingPage = () => {
  const { vendor } = useVendor();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<number, OrderTrackingStatus>>({});

  const loadOrders = async () => {
    if (!vendor?.name) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await requestFromApiCandidates<ApiResponse<VendorOrder[]>>(
        `/api/orders/vendor/${encodeURIComponent(vendor.name)}`
      );
      const data = payload.data || [];
      setOrders(data);

      const draftMap: Record<number, OrderTrackingStatus> = {};
      data.forEach((order) => {
        draftMap[order.id] = order.status;
      });
      setStatusDrafts(draftMap);
    } catch (fetchError) {
      setOrders([]);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load vendor orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, [vendor?.name]);

  const updateOrderStatus = async (orderId: number) => {
    const nextStatus = statusDrafts[orderId];
    if (!nextStatus) {
      return;
    }

    setUpdatingOrderId(orderId);
    setError("");

    try {
      const updatedOrder = await requestFromApiCandidates<VendorOrder>(
        `/api/orders/${orderId}/status?status=${encodeURIComponent(nextStatus)}`,
        { method: "PUT" }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: updatedOrder.status } : order))
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Order Tracking</h2>
        <p className="text-sm text-muted-foreground">Update shipment and delivery status for your orders.</p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-6 py-3 font-medium text-muted-foreground">Order</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Quantity</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Amount</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Current Status</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-6 text-muted-foreground" colSpan={6}>
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-6 py-6 text-muted-foreground" colSpan={6}>
                  No orders found for this vendor.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="px-6 py-4">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">₹{Number(order.totalPrice).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 capitalize">{formatTrackingStatus(order.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                        value={statusDrafts[order.id] || order.status}
                        onChange={(event) =>
                          setStatusDrafts((prev) => ({
                            ...prev,
                            [order.id]: event.target.value as OrderTrackingStatus,
                          }))
                        }
                      >
                        <option value="CREATED">CREATED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="RETURNED">RETURNED</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={() => void updateOrderStatus(order.id)}
                        disabled={updatingOrderId === order.id}
                      >
                        {updatingOrderId === order.id ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorOrderTrackingPage;
