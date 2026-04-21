import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/shared/StatCard";
import { Package, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface ProductRow {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "pending" | "approved" | "rejected";
  vendor: string;
  rating?: number | null;
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

interface MonthlyOrderTrend {
  month: string;
  placed: number;
  returned: number;
  cancelled: number;
}

type OrderFilter = "all" | "placed" | "returned" | "cancelled";

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

const requestFromApiCandidates = async <T,>(path: string, init?: RequestInit): Promise<ApiResponse<T>> => {
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

      return (await response.json()) as ApiResponse<T>;
    } catch {
      lastError = `Network error while connecting to ${apiBase}`;
    }
  }

  throw new Error(lastError);
};

const formatMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" }).format(date);

const isPlacedOrder = (status: OrderTrackingStatus) => status !== "RETURNED" && status !== "CANCELLED";

const buildMonthlyOrderTrend = (orders: VendorOrder[]): MonthlyOrderTrend[] => {
  const now = new Date();
  const monthlyBuckets = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

    return {
      monthKey,
      month: formatMonthLabel(monthDate),
      placed: 0,
      returned: 0,
      cancelled: 0,
    };
  });

  const bucketByKey = new Map(monthlyBuckets.map((bucket) => [bucket.monthKey, bucket]));

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);

    if (Number.isNaN(orderDate.getTime())) {
      return;
    }

    const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
    const bucket = bucketByKey.get(monthKey);

    if (!bucket) {
      return;
    }

    if (order.status === "RETURNED") {
      bucket.returned += 1;
      return;
    }

    if (order.status === "CANCELLED") {
      bucket.cancelled += 1;
      return;
    }

    if (isPlacedOrder(order.status)) {
      bucket.placed += 1;
    }
  });

  return monthlyBuckets;
};

const formatTrackingStatus = (status: OrderTrackingStatus) => status.replace(/_/g, " ");

const VendorDashboard = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorName, setVendorName] = useState<string>("");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let currentVendorName = "";
        if (user?.id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", user.id)
            .single();

          currentVendorName = (profile?.name as string | undefined)?.trim() || "";
          setVendorName(currentVendorName);
        }

        const payload = await requestFromApiCandidates<ProductRow[]>("/api/products");
        const allProducts = payload.data || [];

        const vendorProducts = currentVendorName
          ? allProducts.filter(
              (product) =>
                (product.vendor || "").trim().toLowerCase() === currentVendorName.toLowerCase()
            )
          : allProducts;

        setProducts(vendorProducts);

        if (currentVendorName) {
          const orderPayload = await requestFromApiCandidates<VendorOrder[]>(
            `/api/orders/vendor/${encodeURIComponent(currentVendorName)}`
          );
          setOrders(orderPayload.data || []);
          setOrdersError("");
        } else {
          setOrders([]);
        }
      } catch {
        setProducts([]);
        setOrders([]);
        setOrdersError("Unable to load order details for this vendor.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const totalProducts = products.length;
  const approvedProducts = products.filter((product) => product.status === "approved").length;
  const pendingProducts = products.filter((product) => product.status === "pending").length;
  const rejectedProducts = products.filter((product) => product.status === "rejected").length;

  const bestsellerData = useMemo(() => {
    const productPriceById = new Map<number, number>(
      products.map((product) => [product.id, Number(product.price || 0)])
    );
    const productSales = new Map<
      number,
      { productId: number; productName: string; unitsSold: number; orderRevenue: number }
    >();

    orders.forEach((order) => {
      if (!isPlacedOrder(order.status)) {
        return;
      }

      const existing = productSales.get(order.productId);
      if (existing) {
        existing.unitsSold += Number(order.quantity || 0);
        existing.orderRevenue += Number(order.totalPrice || 0);
        return;
      }

      productSales.set(order.productId, {
        productId: order.productId,
        productName: order.productName || `Product #${order.productId}`,
        unitsSold: Number(order.quantity || 0),
        orderRevenue: Number(order.totalPrice || 0),
      });
    });

    return Array.from(productSales.values())
      .map((entry) => {
        const unitPrice = productPriceById.get(entry.productId) || 0;

        return {
          ...entry,
          revenue: unitPrice > 0 ? unitPrice * entry.unitsSold : entry.orderRevenue,
        };
      })
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 3);
  }, [orders, products]);

  const placedOrders = useMemo(() => {
    return orders.filter((order) => isPlacedOrder(order.status));
  }, [orders]);

  const returnedOrders = useMemo(() => {
    return orders.filter((order) => order.status === "RETURNED");
  }, [orders]);

  const cancelledOrders = useMemo(() => {
    return orders.filter((order) => order.status === "CANCELLED");
  }, [orders]);

  const allCategorizedOrders = useMemo(() => {
    return orders.filter(
      (order) => isPlacedOrder(order.status) || order.status === "RETURNED" || order.status === "CANCELLED"
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === "placed") {
      return placedOrders;
    }

    if (orderFilter === "returned") {
      return returnedOrders;
    }

    if (orderFilter === "cancelled") {
      return cancelledOrders;
    }

    return allCategorizedOrders;
  }, [allCategorizedOrders, cancelledOrders, orderFilter, placedOrders, returnedOrders]);

  const totalIncome = useMemo(() => {
    return placedOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  }, [placedOrders]);

  const monthlyOrderData = useMemo(() => {
    return buildMonthlyOrderTrend(orders);
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => (product.stock || 0) < 5);
  }, [products]);

  const orderFilterButtonClass = (filter: OrderFilter) =>
    orderFilter === filter
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "bg-muted text-muted-foreground hover:bg-muted/80";

  return (
    <div className="space-y-8">
      {lowStockProducts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            The following products have low stock (less than 5 units):{" "}
            {lowStockProducts.map((product) => product.name).join(", ")}.
            Please restock soon to avoid stockouts.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Products"
          value={loading ? "..." : totalProducts}
          icon={<Package className="h-4 w-4 text-foreground" />}
          trend={vendorName ? `Vendor: ${vendorName}` : "Vendor products from database"}
        />
        <StatCard
          label="Approved Products"
          value={loading ? "..." : approvedProducts}
          icon={<CheckCircle2 className="h-4 w-4 text-foreground" />}
          trend="From product status"
        />
        <StatCard
          label="Pending Approval"
          value={loading ? "..." : pendingProducts}
          icon={<Clock3 className="h-4 w-4 text-foreground" />}
          trend="Awaiting admin review"
        />
        <StatCard
          label="Rejected Products"
          value={loading ? "..." : rejectedProducts}
          icon={<AlertTriangle className="h-4 w-4 text-foreground" />}
          trend="Rejected by admin review"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold mb-4">Top 3 Products Sold (Bestsellers)</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading bestseller data...</p>
          ) : bestsellerData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed product sales found yet.</p>
          ) : (
            <div className="space-y-3">
              {bestsellerData.map((product, index) => (
                <div
                  key={`${product.productName}-${index}`}
                  className="rounded-xl border border-border/70 p-3"
                >
                  <div>
                    <p className="font-medium">#{index + 1} {product.productName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-semibold">Order Details by Category</h2>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Income (Placed Orders)</p>
              <p className="text-lg font-semibold">₹{totalIncome.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              type="button"
              size="sm"
              className={orderFilterButtonClass("all")}
              onClick={() => setOrderFilter("all")}
            >
              All ({allCategorizedOrders.length})
            </Button>
            <Button
              type="button"
              size="sm"
              className={orderFilterButtonClass("placed")}
              onClick={() => setOrderFilter("placed")}
            >
              Order Placed ({placedOrders.length})
            </Button>
            <Button
              type="button"
              size="sm"
              className={orderFilterButtonClass("returned")}
              onClick={() => setOrderFilter("returned")}
            >
              Returned ({returnedOrders.length})
            </Button>
            <Button
              type="button"
              size="sm"
              className={orderFilterButtonClass("cancelled")}
              onClick={() => setOrderFilter("cancelled")}
            >
              Cancelled ({cancelledOrders.length})
            </Button>
          </div>

          {ordersError ? <p className="text-sm text-destructive mb-3">{ordersError}</p> : null}

          <div className="max-h-72 overflow-auto rounded-xl border border-border/70">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 sticky top-0">
                <tr className="text-left border-b">
                  <th className="px-3 py-2 font-medium text-muted-foreground">Order</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Product</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Status</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-muted-foreground">
                      Loading order details...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-muted-foreground">
                      No orders available for this category.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="px-3 py-2">#{order.id}</td>
                      <td className="px-3 py-2">
                        <div>
                          <p className="font-medium">{order.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {order.quantity}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2">{formatTrackingStatus(order.status)}</td>
                      <td className="px-3 py-2">₹{Number(order.totalPrice).toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h2 className="font-semibold mb-4">Month-wise Orders Placed vs Returned vs Cancelled</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyOrderData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 15% 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
            />
            <Bar dataKey="placed" name="Placed" fill="hsl(200 52% 88%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="returned" name="Returned" fill="hsl(5 76% 64%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="cancelled" name="Cancelled" fill="hsl(38 92% 60%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VendorDashboard;
