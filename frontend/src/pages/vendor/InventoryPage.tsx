import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductWorkflow } from "@/contexts/ProductWorkflowContext";
import { useVendor } from "@/contexts/VendorContext";
import { toast } from "sonner";

const InventoryPage = () => {
  const { products, updateProductStock } = useProductWorkflow(); 
  const { vendor } = useVendor();

  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});

  const vendorProducts = useMemo(
    () => products.filter((p) => p.vendor === vendor?.name),
    [products, vendor?.name]
  );

  const handleStockChange = (productId: string, value: number) => {
    setStockUpdates((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleUpdate = async (productId: string) => {
    const newStock = stockUpdates[productId];

    if (newStock === undefined || newStock < 0) {
      toast.error("Invalid stock value");
      return;
    }

    try {
      await updateProductStock(productId, newStock); 
      toast.success("Stock updated successfully");
    } catch (err) {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Inventory Management</h2>

      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-6 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Current Stock</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Update</th>
            </tr>
          </thead>

          <tbody>
            {vendorProducts.map((p) => (
              <tr
                key={p.id}
                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{p.name}</td>

                <td className="px-6 py-4">{p.stock}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={
                        stockUpdates[p.id] !== undefined
                          ? stockUpdates[p.id]
                          : p.stock
                      }
                      onChange={(e) =>
                        handleStockChange(p.id, Number(e.target.value))
                      }
                      className="w-24 h-8"
                    />

                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleUpdate(p.id)}
                    >
                      Update
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {vendorProducts.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;