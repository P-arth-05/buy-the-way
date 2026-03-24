import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw, Truck, CreditCard } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-4 text-center">Returns & Refunds</h1>
      <p className="text-center text-muted-foreground mb-12">Everything you need to know about our 14-day return policy and reverse logistics.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <RefreshCcw className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-bold mb-2">14-Day Returns</h3>
            <p className="text-sm text-muted-foreground">Request a return within 14 days of your delivery date for eligible items.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Truck className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-bold mb-2">Easy Pickup</h3>
            <p className="text-sm text-muted-foreground">Our reverse logistics team will pick up the item directly from your address.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <CreditCard className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-bold mb-2">Fast Refunds</h3>
            <p className="text-sm text-muted-foreground">Refunds are processed to your original payment method within 5-7 business days.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}