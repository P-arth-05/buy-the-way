import { Button } from "@/components/ui/button";
import { useProductWorkflow } from "@/contexts/ProductWorkflowContext";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

const ApprovalsPage = () => {
  const { products, categoryRequests, updateProductStatus, updateCategoryStatus } = useProductWorkflow();

  const pendingProducts = products.filter((product) => product.status === "pending");
  const pendingCategoryRequests = categoryRequests.filter((request) => request.status === "pending");

  const handleProductAction = (id: string, action: "approved" | "rejected") => {
    updateProductStatus(id, action);
    toast.success(`Product ${action}.`);
  };

  const handleCategoryAction = (id: string, action: "approved" | "rejected") => {
    updateCategoryStatus(id, action);
    toast.success(`Category ${action}.`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Pending Approvals</h2>

      <div className="bg-card rounded-2xl shadow-soft p-6 mb-6">
        <h3 className="text-base font-semibold mb-4">Category Requests</h3>
        {pendingCategoryRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending category requests.</p>
        ) : (
          <div className="space-y-3">
            {pendingCategoryRequests.map((request) => (
              <div key={request.id} className="border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{request.name}</p>
                  <p className="text-xs text-muted-foreground">Requested by {request.vendor}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="soft" size="sm" onClick={() => handleCategoryAction(request.id, "approved")}>
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCategoryAction(request.id, "rejected")}>
                    <X className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingProducts.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-soft p-8 text-center text-muted-foreground">
          No pending products to review.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pendingProducts.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full aspect-video object-cover" />
              <div className="p-5 space-y-3">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">${p.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">by {p.vendor}</span>
                </div>
                <div className="text-xs text-muted-foreground">Category: {p.category} ({p.categoryStatus || "approved"})</div>
                <div className="flex gap-2 pt-1">
                  <Button variant="soft" size="sm" className="flex-1" onClick={() => handleProductAction(p.id, "approved")}>
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleProductAction(p.id, "rejected")}>
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
