import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/order-tracking");
      setLoading(false);
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No items to checkout.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-card rounded-2xl shadow-soft p-6 space-y-4">
            <h2 className="font-semibold">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input required placeholder="John" className="mt-1.5" /></div>
              <div><Label>Last Name</Label><Input required placeholder="Doe" className="mt-1.5" /></div>
            </div>
            <div><Label>Address</Label><Input required placeholder="123 Main St" className="mt-1.5" /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><Label>City</Label><Input required placeholder="City" className="mt-1.5" /></div>
              <div><Label>State</Label><Input required placeholder="State" className="mt-1.5" /></div>
              <div><Label>ZIP</Label><Input required placeholder="12345" className="mt-1.5" /></div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-soft p-6 space-y-4">
            <h2 className="font-semibold">Payment Method</h2>
            <div><Label>Card Number</Label><Input placeholder="•••• •••• •••• ••••" className="mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Expiry</Label><Input placeholder="MM/YY" className="mt-1.5" /></div>
              <div><Label>CVC</Label><Input placeholder="•••" className="mt-1.5" /></div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card rounded-2xl shadow-soft p-6 space-y-4 sticky top-24">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{product.name} × {quantity}</span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Placing order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
