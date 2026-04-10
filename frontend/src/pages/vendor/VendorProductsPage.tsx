import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ManagedProduct, useProductWorkflow } from "@/contexts/ProductWorkflowContext";
import { cn } from "@/lib/com.buytheway.common.utils";
import { toast } from "sonner";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
} as const;

const VendorProductsPage = () => {
  const { products, updateProductDescription } = useProductWorkflow();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState("");

  const startEditing = (product: ManagedProduct) => {
    setEditingProductId(product.id);
    setDraftDescription(product.description);
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setDraftDescription("");
  };

  const saveDescription = (productId: string) => {
    const trimmedDescription = draftDescription.trim();
    if (!trimmedDescription) {
      toast.error("Description cannot be empty.");
      return;
    }

    updateProductDescription(productId, trimmedDescription);
    setEditingProductId(null);
    setDraftDescription("");
    toast.success("Product description updated.");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Your Products</h2>
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-6 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Description</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Stock</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Price</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Category Status</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isEditing = editingProductId === p.id;

              return (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors align-top">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 min-w-[320px]">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={draftDescription}
                          onChange={(e) => setDraftDescription(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[90px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <div className="flex items-center gap-2">
                          <Button onClick={() => saveDescription(p.id)}>Save</Button>
                          <Button className="bg-background border border-input text-foreground hover:bg-muted" onClick={cancelEditing}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-muted-foreground line-clamp-3">{p.description}</p>
                        <Button className="bg-background border border-input text-foreground hover:bg-muted" onClick={() => startEditing(p)}>
                          Edit Description
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{p.stock}</td>
                  <td className="px-6 py-4">₹{p.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", statusStyles[p.categoryStatus || "approved"])}>
                      {p.categoryStatus || "approved"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", statusStyles[p.status])}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorProductsPage;
