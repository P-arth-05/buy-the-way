import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/shared/StatCard";
import { Package, CheckCircle2, Clock3, IndianRupee } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabase";

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface ProductRow {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "pending" | "approved" | "rejected";
  vendor: string;
  rating?: number | null;
}

const API_BASE_URL =
  (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__ ||
  "http://localhost:8080";

const VendorDashboard = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorName, setVendorName] = useState<string>("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let currentVendorName = "";
        if (user?.id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", user.id)
            .single();

          currentVendorName = (profile?.name as string | undefined)?.trim() || "";
          setVendorName(currentVendorName);
        }

        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products (${response.status})`);
        }

        const payload = (await response.json()) as ApiResponse<ProductRow[]>;
        const allProducts = payload.data || [];

        const vendorProducts = currentVendorName
          ? allProducts.filter(
              (product) =>
                (product.vendor || "").trim().toLowerCase() === currentVendorName.toLowerCase()
            )
          : allProducts;

        setProducts(vendorProducts);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const totalProducts = products.length;
  const approvedProducts = products.filter((product) => product.status === "approved").length;
  const pendingProducts = products.filter((product) => product.status === "pending").length;
  const stockValue = products.reduce(
    (sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const chartData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [products]);

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Products"
          value={loading ? "..." : totalProducts}
          icon={<Package className="h-4 w-4 text-foreground" />}
          trend={vendorName ? `Vendor: ${vendorName}` : "Vendor products from database"}
        />
        <StatCard
          label="Approved Products"
          value={loading ? "..." : approvedProducts}
          icon={<CheckCircle2 className="h-4 w-4 text-foreground" />}
          trend="From product status"
        />
        <StatCard
          label="Pending Approval"
          value={loading ? "..." : pendingProducts}
          icon={<Clock3 className="h-4 w-4 text-foreground" />}
          trend="Awaiting admin review"
        />
        <StatCard
          label="Inventory Value"
          value={loading ? "..." : `₹${stockValue.toFixed(2)}`}
          icon={<IndianRupee className="h-4 w-4 text-foreground" />}
          trend="price × stock"
        />
      </div>

      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h2 className="font-semibold mb-4">Top Categories by Product Count</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 15% 88%)" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }} />
            <Bar dataKey="count" fill="hsl(200 52% 88%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VendorDashboard;
