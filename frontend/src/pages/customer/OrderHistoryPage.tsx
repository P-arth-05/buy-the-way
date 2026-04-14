import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "@/lib/orderApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrders();
    } catch {
      toast.error("Cancel failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 rounded mb-4">

            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            <p>Status: {order.status}</p>

            {/* ✅ PRODUCT UI */}
            <div className="flex gap-4 items-center mt-3">
              <img
                src={order.productImage}
                alt={order.productName}
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <p className="font-semibold">{order.productName}</p>
                <p className="text-sm text-gray-500">
                  {order.productDescription}
                </p>
              </div>
            </div>

            <p className="mt-2">Quantity: {order.quantity}</p>
            <p>Total: ₹{order.totalPrice}</p>

            {order.status === "CREATED" && (
              <Button
                variant="destructive"
                onClick={() => handleCancel(order.id)}
                className="mt-3"
              >
                Cancel Order
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
}