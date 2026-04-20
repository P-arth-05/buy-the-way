import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const MAX_QTY_PER_ITEM = 5;
const MAX_TOTAL_ITEMS = 5;

const supabase = createClient(
  "https://azmnrmazqsbrzlukovrs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bW5ybWF6cXNicnpsdWtvdnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzM5OTIsImV4cCI6MjA5MDQ0OTk5Mn0.RSNfMS7asiZ0ALs2S3YJG38txl6T2CoBE6fQZ45wu9Q"
);

export default function CartPage() {
  const { items, total, addToCart, removeFromCart, decreaseQty } = useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (totalItems > MAX_TOTAL_ITEMS) {
      toast.error(`You can only checkout max ${MAX_TOTAL_ITEMS} items.`);
      return;
    }

    const invalid = items.some((item) => item.quantity > MAX_QTY_PER_ITEM);
    if (invalid) {
      toast.error(`Max ${MAX_QTY_PER_ITEM} quantity per product.`);
      return;
    }

    setCheckingOut(true);
    try {
      const productIds = items.map((item) => item.product.id);

      console.log("Cart product IDs:", productIds);
      console.log("ID types:", productIds.map((id) => typeof id));

      const { data, error, status, statusText } = await supabase
        .from("products")
        .select("id, name, stock")
        .in("id", productIds);

      console.log("Supabase status:", status, statusText);
      console.log("Supabase error:", error);
      console.log("Supabase data:", data);

      if (error) {
        toast.error("Could not verify stock. Please try again.");
        return;
      }

      if (!data || data.length === 0) {
        toast.error("No products found — check console for details.");
        return;
      }

      const outOfStock: string[] = [];

      for (const item of items) {
        const product = data.find(
          (p) => String(p.id) === String(item.product.id)
        );

        console.log(`Matching "${item.product.id}" →`, product ?? "NOT FOUND");

        if (!product || product.stock < item.quantity) {
          outOfStock.push(
            `${item.product.name} (requested: ${item.quantity}, available: ${product?.stock ?? 0})`
          );
        }
      }

      if (outOfStock.length > 0) {
        toast.error(
          <div>
            <p className="font-semibold mb-1">Insufficient stock:</p>
            <ul className="list-disc list-inside text-sm">
              {outOfStock.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        );
        return;
      }

      navigate("/checkout");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/shop")}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4"
      >
        <span className="text-lg">←</span>
        Back to shop
      </button>
      <h1 className="text-2xl mb-6">Cart</h1>

      {items.length === 0 && (
        <p className="text-gray-500">Your cart is empty</p>
      )}

      {items.map((item) => (
        <div
          key={item.product.id}
          className="border p-4 mb-4 rounded flex items-center gap-4"
        >
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-24 h-24 object-cover rounded"
          />

          <div className="flex-1">
            <p className="font-medium">{item.product.name}</p>
            <p className="text-gray-600">₹{item.product.price}</p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => decreaseQty(item.product.id)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => {
                  if (item.quantity >= MAX_QTY_PER_ITEM) {
                    toast.error("Max quantity reached");
                    return;
                  }
                  addToCart(item.product);
                }}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className="ml-4 text-red-500 hover:text-red-700"
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {item.quantity > MAX_QTY_PER_ITEM && (
              <p className="text-red-500 text-sm mt-1">Exceeds per-item limit</p>
            )}
          </div>
        </div>
      ))}

      <h2 className="text-xl mt-4 font-semibold">Total: ₹{total}</h2>

      <button
        onClick={handleCheckout}
        disabled={checkingOut}
        className="mt-4 bg-gray-900 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checkingOut ? "Checking stock..." : "Checkout"}
      </button>
    </div>
  );
}