import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, Wallet, Banknote, Smartphone } from "lucide-react";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(4, "Zip code is required"),
  paymentMethod: z.enum(["card", "upi", "netbanking", "wallet", "cod"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { total, clearCart, items } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "card" },
  });

  const paymentMethod = watch("paymentMethod");

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate("/")}>Go back to shopping</Button>
      </div>
    );
  }

  const onSubmit = (data: CheckoutFormValues) => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      clearCart();
      setIsProcessing(false);
      toast.success("Order placed successfully!", {
        description: `Your Order ID is ${mockOrderId}`,
      });
      navigate("/order-tracking", { state: { orderId: mockOrderId } });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="123 Main St" {...register("address")} />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" {...register("city")} />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" placeholder="10001" {...register("zipCode")} />
                  {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue="card" 
                onValueChange={(value) => setValue("paymentMethod", value as CheckoutFormValues["paymentMethod"])}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
                  { id: "upi", label: "UPI", icon: Smartphone },
                  { id: "netbanking", label: "Net Banking", icon: Banknote },
                  { id: "wallet", label: "Digital Wallet", icon: Wallet },
                  { id: "cod", label: "Cash on Delivery", icon: CheckCircle2 },
                ].map((method) => (
                  <div key={method.id} className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`} onClick={() => setValue("paymentMethod", method.id as CheckoutFormValues["paymentMethod"])}>
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex flex-1 items-center gap-2 cursor-pointer">
                      <method.icon className="h-4 w-4 text-muted-foreground" />
                      {method.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="truncate pr-4">{item.quantity}x {item.product.name}</span>
                    <span>INR{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>INR{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>INR{total.toFixed(2)}</span>
              </div>
              <Button type="submit" className="w-full mt-6" size="lg" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}