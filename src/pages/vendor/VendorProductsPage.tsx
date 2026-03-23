import { MOCK_PRODUCTS } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const VendorProductsPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-6">Your Products</h2>
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="px-6 py-3 font-medium text-muted-foreground">Product</th>
            <th className="px-6 py-3 font-medium text-muted-foreground">Stock</th>
            <th className="px-6 py-3 font-medium text-muted-foreground">Price</th>
            <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_PRODUCTS.map((p) => (
            <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 flex items-center gap-3">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                <span className="font-medium">{p.name}</span>
              </td>
              <td className="px-6 py-4">{p.stock}</td>
              <td className="px-6 py-4">${p.price.toFixed(2)}</td>
              <td className="px-6 py-4">
                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", statusStyles[p.status])}>
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default VendorProductsPage;
