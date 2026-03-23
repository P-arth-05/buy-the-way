import { useState } from "react";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

const ApprovalsPage = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS.filter(p => p.status === "pending"));

  const handle = (id: string, action: "approved" | "rejected") => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success(`Product ${action}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Pending Approvals</h2>
      {products.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-soft p-8 text-center text-muted-foreground">
          No pending products to review.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full aspect-video object-cover" />
              <div className="p-5 space-y-3">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">${p.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">by {p.vendor}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="soft" size="sm" className="flex-1" onClick={() => handle(p.id, "approved")}>
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handle(p.id, "rejected")}>
                    <X className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;
