

import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const MAX_QTY = 5;

export default function CartPage() {
  const { items, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const invalid = items.some(item => item.quantity > MAX_QTY);

    if (invalid) {
      toast.error(`Max ${MAX_QTY} items in stock.`);
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-6">Cart</h1>

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
            <p className="text-sm text-gray-500">
              Qty: {item.quantity}
              {item.quantity > MAX_QTY && (
                <span className="text-red-500 ml-2">
                  (Exceeds limit)
                </span>
              )}
            </p>
          </div>
        </div>
      ))}

      <h2 className="text-xl mt-4 font-semibold">Total: ₹{total}</h2>

      <button
        onClick={handleCheckout}
        className="mt-4 bg-gray-900 text-white px-6 py-2 rounded"
      >
        Checkout
      </button>
    </div>
  );
}