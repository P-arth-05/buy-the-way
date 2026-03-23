import { Check, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Order Placed", icon: Package, date: "Mar 20, 2026", done: true },
  { label: "Shipped", icon: Truck, date: "Mar 21, 2026", done: true },
  { label: "Delivered", icon: Check, date: "Expected Mar 24", done: false },
];

const OrderTrackingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Order Tracking</h1>
      <p className="text-muted-foreground mb-10">Order #ORD-2026-0042</p>

      <div className="bg-card rounded-2xl shadow-soft p-8">
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                  step.done ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <step.icon className="h-5 w-5" />
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("w-0.5 h-12 my-1", step.done ? "bg-accent" : "bg-border")} />
                )}
              </div>
              <div className="pt-2">
                <p className={cn("font-medium text-sm", !step.done && "text-muted-foreground")}>{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
