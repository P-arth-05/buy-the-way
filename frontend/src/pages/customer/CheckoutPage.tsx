import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/orderApi";
import { toast } from "sonner";

type CheckoutFormValues = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: string;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, total } = useCart();

  const [form, setForm] = useState<CheckoutFormValues>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ NEW: email error state
  const [emailError, setEmailError] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    try {
      setIsProcessing(true);

      // ✅ EMAIL VALIDATION
      if (!form.email) {
        setEmailError(true);
        toast.error("Please enter your email");
        return;
      } else {
        setEmailError(false);
      }

      // ✅ COD FLOW
      if (form.paymentMethod === "cod") {
        for (const item of items) {
          await createOrder(item.product.id, item.quantity, form.email);
        }

        toast.success("Order placed successfully");
        clearCart();
        navigate("/order-history");
        return;
      }

      // ✅ RAZORPAY FLOW
      const amount = total * 100;

      const res = await fetch(
        "http://localhost:8080/api/payments/create-razorpay-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );

      const order = await res.json();

      const options = {
        key: "rzp_test_Sd4ompYX4WwxTy",
        amount: order.amount,
        currency: "INR",
        name: "Buy The Way",
        description: "Order Payment",
        order_id: order.id,

        handler: async function () {
          for (const item of items) {
            await createOrder(item.product.id, item.quantity, form.email);
          }

          toast.success("Payment successful");
          clearCart();
          navigate("/order-history");
        },

        prefill: {
          name: form.fullName,
          email: form.email,
        },

        theme: {
          color: "#111827",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-900">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* SHIPPING */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Shipping
            </h2>

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            {/* ✅ UPDATED EMAIL INPUT */}
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => {
                handleChange(e);
                setEmailError(false);
              }}
              className={`w-full mb-3 px-4 py-4 text-base border rounded-lg focus:outline-none transition
                ${emailError
                  ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-gray-900"}
              `}
            />

            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* PAYMENT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Payment
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {["card", "upi", "netbanking", "cod"].map((method) => (
                <label
                  key={method}
                  className={`border p-3 rounded-md cursor-pointer flex items-center gap-2 transition ${
                    form.paymentMethod === method
                      ? "border-gray-900 bg-gray-100"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange}
                  />
                  {method === "cod"
                    ? "Cash on Delivery"
                    : method.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Total
          </h2>

          <p className="text-2xl font-bold mb-6 text-gray-900">
            ₹{total}
          </p>

          <button
            onClick={onSubmit}
            disabled={isProcessing}
            className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition"
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </div>

      </div>
    </div>
  );
}