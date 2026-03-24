import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle, Search, Clock, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const STATUS_STEPS = [
  { id: "processing", label: "Processing", icon: Clock },
  { id: "shipped", label: "Shipped", icon: Package },
  { id: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderTrackingPage() {
  const location = useLocation();
  const [searchId, setSearchId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<string | null>(null);
  
  
  const currentStepIndex = 1; 
  const isDelivered = currentStepIndex === STATUS_STEPS.length - 1;

  useEffect(() => {
    if (location.state && location.state.orderId) {
      setSearchId(location.state.orderId);
      setTrackedOrder(location.state.orderId);
    }
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) setTrackedOrder(searchId.trim().toUpperCase());
  };

  const handleReturnRequest = () => {
    toast.success("Return Request Initiated", {
      description: "You will receive an email with reverse logistics instructions shortly.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
        <p className="text-muted-foreground mb-8">Enter your order ID below to check the current status of your delivery.</p>
        
        <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
          <Input 
            placeholder="Enter Order ID (e.g., ORD-123456)" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" /> Track
          </Button>
        </form>
      </div>

      {trackedOrder && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Order #{trackedOrder}</CardTitle>
                <CardDescription>
                  {isDelivered ? "Delivered on " : "Estimated Delivery: "} 
                  {new Date().toLocaleDateString()}
                </CardDescription>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDelivered ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                {isDelivered ? "Delivered" : "In Transit"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative mb-12">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-1000 rounded-full" 
                style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              />

              <div className="relative flex justify-between z-10">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                        isCompleted 
                          ? "bg-primary border-primary/20 text-primary-foreground" 
                          : "bg-background border-muted text-muted-foreground"
                      }`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className={`text-sm font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SRS Requirement: Return/Refund Initiation */}
            {isDelivered && (
              <div className="flex flex-col items-center justify-center pt-6 border-t border-dashed">
                <p className="text-sm text-muted-foreground mb-4">Not satisfied with your order? You have 14 days to return it.</p>
                <Button variant="outline" className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleReturnRequest}>
                  <RefreshCcw className="h-4 w-4" /> Request Return / Refund
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}