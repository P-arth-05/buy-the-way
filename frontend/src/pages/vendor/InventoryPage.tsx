import { MOCK_PRODUCTS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const InventoryPage = () => (
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
          {MOCK_PRODUCTS.map((p) => (
            <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 font-medium">{p.name}</td>
              <td className="px-6 py-4">{p.stock}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue={p.stock} className="w-24 h-8" />
                  <Button variant="soft" size="sm">Update</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default InventoryPage;
