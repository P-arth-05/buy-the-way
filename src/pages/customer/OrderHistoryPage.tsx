import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";

export default function OrderHistoryPage() {
  // Mock data for past orders
  const pastOrders = [
    { id: "ORD-987654", date: new Date().toLocaleDateString(), total: 124.97, status: "In Transit", items: 3 },
    { id: "ORD-123456", date: "2026-02-20", total: 49.99, status: "Delivered", items: 1 },
  ];
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {pastOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 pb-4">
              <div>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">INR{order.total.toFixed(2)}</p>
                <p className="text-sm text-green-600 font-medium">{order.status}</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{order.items} item(s) in this order.</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/order-tracking" state={{ orderId: order.id }} className="gap-2">
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}