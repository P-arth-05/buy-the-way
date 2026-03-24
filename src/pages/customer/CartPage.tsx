import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Button className="w-full" size="lg" onClick={() => navigate("/")}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-24 h-24 rounded-md overflow-hidden shrink-0 bg-muted">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  <p className="font-bold mt-2">${item.product.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Estimated Total</span>
                <span className="font-bold text-2xl">${total.toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full gap-2" onClick={() => navigate("/checkout")}>
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}