import { useState } from "react";
import { getOrderById } from "../../lib/orderApi";

type Order = {
  id: number;
  status: string;
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    try {
      setError("");
      const data = await getOrderById(Number(orderId));
      setOrder(data);
    } catch (err) {
      setError("Order not found");
      setOrder(null);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;

    switch (status) {
      case "CREATED":
        return 0;
      case "SHIPPED":
        return 1;
      case "OUT_FOR_DELIVERY":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : -1;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-semibold text-center mb-2">
        Track Your Order
      </h1>

      <p className="text-center text-gray-500 mb-6">
        Enter your order ID below to check the current status of your delivery.
      </p>

      {/* INPUT */}
      <div className="flex justify-center gap-3 mb-8">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter order ID"
          className="border rounded-full px-5 py-2 w-80 focus:outline-none"
        />

        <button
          onClick={handleTrack}
          className="flex items-center gap-2 bg-[#1f3b3a] text-white px-5 py-2 rounded-full hover:opacity-90"
        >
          🔍 Track
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-center text-red-500 mb-4">{error}</p>
      )}

      {/* ORDER CARD */}
      {order && (
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          
          {/* ✅ CANCELLED UI */}
          {order.status === "CANCELLED" ? (
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Order #{order.id} Cancelled
              </h2>
              <p className="text-gray-500">
                This order has been cancelled and will not be processed.
              </p>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order #{order.id}
                  </h2>
                </div>

                <span className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm">
                  {order.status === "CREATED" && "Processing"}
                  {order.status === "SHIPPED" && "In Transit"}
                  {order.status === "OUT_FOR_DELIVERY" && "Out for Delivery"}
                  {order.status === "DELIVERED" && "Delivered"}
                </span>
              </div>

              {/* PROGRESS BAR */}
              <div className="flex items-center justify-between relative mt-8">
                {/* LINE */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 z-0"></div>

                {[
                  { label: "Created", icon: "🕒" },
                  { label: "Shipped", icon: "📦" },
                  { label: "Out for Delivery", icon: "🚚" },
                  { label: "Delivered", icon: "✔️" },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center z-10 flex-1"
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border
                      ${
                        index <= currentStep
                          ? "bg-[#1f3b3a] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>

                    <span className="text-sm mt-2 text-center">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}