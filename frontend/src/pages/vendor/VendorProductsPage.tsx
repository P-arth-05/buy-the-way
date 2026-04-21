import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ManagedProduct, useProductWorkflow } from "@/contexts/ProductWorkflowContext";
import { useVendor } from "@/contexts/VendorContext";
import { cn } from "@/lib/com.buytheway.common.utils";
import { toast } from "sonner";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
} as const;

const VendorProductsPage = () => {
  const { products, updateProductDescription, updateProductPrice } = useProductWorkflow();
  const { vendor } = useVendor();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState("");
  const [editingPriceProductId, setEditingPriceProductId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState<number | string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const vendorProducts = useMemo(
    () => products.filter((p) => p.vendor === vendor?.name),
    [products, vendor?.name]
  );

  const filteredVendorProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return vendorProducts;
    }

    return vendorProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.description,
        product.category,
        product.status,
        product.categoryStatus || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery, vendorProducts]);

  const startEditing = (product: ManagedProduct) => {
    setEditingProductId(product.id);
    setDraftDescription(product.description);
  };

  const cancelEditing = () => {
    setEditingProductId(null);
    setDraftDescription("");
  };

  const saveDescription = async (productId: string) => {
    const trimmedDescription = draftDescription.trim();
    if (!trimmedDescription) {
      toast.error("Description cannot be empty.");
      return;
    }

    try {
      await updateProductDescription(productId, trimmedDescription);
      setEditingProductId(null);
      setDraftDescription("");
      toast.success("Product description updated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update product description.";
      toast.error(message);
    }
  };

  const startEditingPrice = (product: ManagedProduct) => {
    setEditingPriceProductId(product.id);
    setDraftPrice(product.price);
  };

  const cancelEditingPrice = () => {
    setEditingPriceProductId(null);
    setDraftPrice("");
  };

  const savePrice = async (productId: string) => {
    const price = parseFloat(String(draftPrice));
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    try {
      await updateProductPrice(productId, price);
      setEditingPriceProductId(null);
      setDraftPrice("");
      toast.success("Product price updated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update product price.";
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Your Products</h2>
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search products by name, description, category, or status..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-xl"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Showing {filteredVendorProducts.length} of {vendorProducts.length} products
        </p>
      </div>
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
            {filteredVendorProducts.map((p) => {
              const isEditing = editingProductId === p.id;
              const isEditingPrice = editingPriceProductId === p.id;

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
                  <td className="px-6 py-4">
                    {isEditingPrice ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">₹</span>
                          <input
                            type="number"
                            value={draftPrice}
                            onChange={(e) => setDraftPrice(e.target.value)}
                            className="w-24 rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => savePrice(p.id)}>Save</Button>
                          <Button size="sm" className="bg-background border border-input text-foreground hover:bg-muted" onClick={cancelEditingPrice}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p>₹{p.price.toFixed(2)}</p>
                        <Button size="sm" className="bg-background border border-input text-foreground hover:bg-muted" onClick={() => startEditingPrice(p)}>
                          Edit Price
                        </Button>
                      </div>
                    )}
                  </td>
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

        {filteredVendorProducts.length === 0 && vendorProducts.length > 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProductsPage;
