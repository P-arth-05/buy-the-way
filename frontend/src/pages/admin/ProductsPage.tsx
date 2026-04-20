import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ManagedProduct, useProductWorkflow } from "@/contexts/ProductWorkflowContext";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
} as const;

const ProductsPage = () => {
  const { products, updateProductPrice, deleteProduct } = useProductWorkflow();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState("");

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const text = [
        product.name,
        product.category,
        product.vendor,
        product.status,
        product.description,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [products, searchQuery]);

  const startPriceEdit = (product: ManagedProduct) => {
    setEditingProductId(product.id);
    setDraftPrice(product.price.toFixed(2));
  };

  const cancelPriceEdit = () => {
    setEditingProductId(null);
    setDraftPrice("");
  };

  const savePrice = async (productId: string) => {
    const priceValue = Number(draftPrice);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      toast.error("Enter a valid price.");
      return;
    }

    try {
      await updateProductPrice(productId, priceValue);
      toast.success("Price updated successfully.");
      cancelPriceEdit();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update price.";
      toast.error(message);
    }
  };

  const handleRemove = async (productId: string) => {
    if (!window.confirm("Remove this product permanently?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      toast.success("Product removed.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to remove product.";
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">All Products</h2>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Manage the full catalog, update pricing, and remove listings.</p>
          <p className="text-xs text-muted-foreground">Showing {filteredProducts.length} of {products.length} products.</p>
        </div>

        <Input
          type="search"
          placeholder="Search products, category, vendor, or status..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-xl"
        />
      </div>

      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-6 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Vendor</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Category</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Stock</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Price</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const isEditing = editingProductId === product.id;

              return (
                <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors align-top">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="space-y-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.vendor}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={draftPrice}
                          onChange={(event) => setDraftPrice(event.target.value)}
                          className="w-28"
                        />
                        <Button size="sm" onClick={() => savePrice(product.id)}>
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={cancelPriceEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>₹{product.price.toFixed(2)}</span>
                        <Button variant="outline" size="sm" onClick={() => startPriceEdit(product)}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-y-2">
                    <Button variant="destructive" size="sm" className="w-full" onClick={() => handleRemove(product.id)}>
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="p-6 text-center text-muted-foreground">No products match your search.</div>
        )}

        {products.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">No products available yet.</div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
