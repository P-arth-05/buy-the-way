import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/orderApi";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://azmnrmazqsbrzlukovrs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bW5ybWF6cXNicnpsdWtvdnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzM5OTIsImV4cCI6MjA5MDQ0OTk5Mn0.RSNfMS7asiZ0ALs2S3YJG38txl6T2CoBE6fQZ45wu9Q"
);

type CheckoutFormValues = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: string;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Promo code state ──────────────────────────────────────────
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null); // percentage e.g. 15
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  // ─────────────────────────────────────────────────────────────

  const discountedTotal =
    appliedDiscount !== null
      ? Math.round(total * (1 - appliedDiscount / 100))
      : total;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Apply promo code ──────────────────────────────────────────
  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a promo code.");
      return;
    }

    setPromoLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      const { data, error } = await supabase
        .from("discounts")
        .select("code, percentage, start_date, end_date")
        .eq("code", code)
        .single();

      if (error || !data) {
        toast.error("Invalid promo code.");
        setAppliedDiscount(null);
        setAppliedPromoCode(null);
        return;
      }

      if (today < data.start_date || today > data.end_date) {
        toast.error("This promo code has expired or is not yet active.");
        setAppliedDiscount(null);
        setAppliedPromoCode(null);
        return;
      }

      setAppliedDiscount(data.percentage);
      setAppliedPromoCode(data.code);
      toast.success(`Promo applied! ${data.percentage}% off`);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    setAppliedPromoCode(null);
    setPromoCode("");
    toast.info("Promo code removed.");
  };
  // ─────────────────────────────────────────────────────────────

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Required";
    } else if (!/^[A-Za-z ]{3,}$/.test(form.fullName)) {
      newErrors.fullName = "Invalid name format";
    }

    if (!form.email.trim()) {
      newErrors.email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.address.trim()) {
      newErrors.address = "Required";
    } else if (form.address.length < 5) {
      newErrors.address = "Too short";
    }

    if (!form.city.trim()) {
      newErrors.city = "Required";
    } else if (!/^[A-Za-z ]{2,}$/.test(form.city)) {
      newErrors.city = "Invalid city format";
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = "Required";
    } else if (!/^[1-9][0-9]{5}$/.test(form.pincode)) {
      newErrors.pincode = "Invalid pincode format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    try {
      setIsProcessing(true);

      const MAX_QTY = 5;
      if (items.some((item) => item.quantity > MAX_QTY)) {
        toast.error(`Max ${MAX_QTY} items allowed`);
        return;
      }

      const isValid = validateForm();
      if (!isValid) {
        toast.error("Please provide valid details");
        return;
      }

      // COD
      if (form.paymentMethod === "cod") {
        for (const item of items) {
          await createOrder({
            productId: item.product.id,
            quantity: item.quantity,
            email: form.email,
            fullName: form.fullName,
            address: form.address,
            city: form.city,
            pincode: form.pincode,
          });
        }

        toast.success("Order placed");
        clearCart();
        navigate("/order-history");
        return;
      }

      // Razorpay — use discountedTotal
      const amount = discountedTotal * 100;

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
        order_id: order.id,

        handler: async function () {
          for (const item of items) {
            await createOrder({
              productId: item.product.id,
              quantity: item.quantity,
              email: form.email,
              fullName: form.fullName,
              address: form.address,
              city: form.city,
              pincode: form.pincode,
            });
          }

          toast.success("Payment successful");
          clearCart();
          navigate("/order-history");
        },

        prefill: {
          name: form.fullName,
          email: form.email,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const inputStyle = (field: keyof FormErrors) =>
    `w-full p-3 border rounded-md outline-none transition
    ${
      errors[field]
        ? "border-red-500 bg-red-50"
        : "border-gray-300 focus:ring-2 focus:ring-gray-900"
    }`;

  const errorText = "text-sm text-red-500 mt-1";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => navigate("/shop")}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4"
      >
        <span className="text-lg">←</span>
        Back to shop
      </button>
      <h1 className="text-3xl font-semibold mb-8 text-center">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="font-semibold mb-4">Shipping</h2>

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className={inputStyle("fullName")}
            />
            {errors.fullName && <p className={errorText}>{errors.fullName}</p>}

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={inputStyle("email")}
            />
            {errors.email && <p className={errorText}>{errors.email}</p>}

            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className={inputStyle("address")}
            />
            {errors.address && <p className={errorText}>{errors.address}</p>}

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className={inputStyle("city")}
            />
            {errors.city && <p className={errorText}>{errors.city}</p>}

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className={inputStyle("pincode")}
            />
            {errors.pincode && <p className={errorText}>{errors.pincode}</p>}
          </div>

          {/* PROMO CODE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Promo Code</h2>

            {appliedPromoCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-md px-4 py-3">
                <span className="text-green-700 font-medium">
                  {appliedPromoCode} — {appliedDiscount}% off applied!
                </span>
                <button
                  onClick={handleRemovePromo}
                  className="text-sm text-red-500 hover:text-red-700 ml-4"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-900"
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading}
                  className="bg-gray-900 text-white px-5 py-3 rounded-md disabled:opacity-50"
                >
                  {promoLoading ? "Checking..." : "Apply"}
                </button>
              </div>
            )}
          </div>

          {/* PAYMENT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Payment</h2>

            <div className="grid grid-cols-2 gap-4">
              {["card", "upi", "netbanking", "cod"].map((method) => (
                <label
                  key={method}
                  className={`border p-3 rounded-md cursor-pointer flex gap-2 ${
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
                  {method === "cod" ? "Cash on Delivery" : method.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow h-fit space-y-3">
          <h2 className="font-semibold mb-2">Order Summary</h2>

          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          {appliedDiscount !== null && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedDiscount}%)</span>
              <span>− ₹{total - discountedTotal}</span>
            </div>
          )}

          <div className="border-t pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{discountedTotal}</span>
          </div>

          <button
            onClick={onSubmit}
            disabled={isProcessing}
            className="w-full bg-gray-900 text-white py-3 rounded-md mt-2 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}