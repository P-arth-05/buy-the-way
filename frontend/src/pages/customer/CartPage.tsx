import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-6">Cart</h1>

      {items.map((item) => (
        <div key={item.product.id} className="border p-4 mb-3 rounded">
          <p>{item.product.name}</p>
          <p>₹{item.product.price}</p>
          <p>Qty: {item.quantity}</p>
        </div>
      ))}

      <h2 className="text-xl mt-4">Total: ₹{total}</h2>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-4 bg-gray-900 text-white px-4 py-2 rounded"
      >
        Checkout
      </button>
    </div>
  );
}