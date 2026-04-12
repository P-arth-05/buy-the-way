import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/shared/StatCard";
import { Users, Package, ShoppingBag, AlertCircle, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface UserRow {
  id: number;
  active?: boolean;
}

interface ProductRow {
  id: number;
  status: "pending" | "approved" | "rejected";
}

interface OrderRow {
  id: number;
  status: string;
}

const API_BASE_URL =
  (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__ ||
  "http://localhost:8080";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [apiHealthy, setApiHealthy] = useState(false);
  const [apiLatencyMs, setApiLatencyMs] = useState<number | null>(null);
  const [customers, setCustomers] = useState<UserRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [vendorsCount, setVendorsCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const startedAt = performance.now();

      const [usersRes, productsRes, ordersRes, vendorsRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/users`).then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }
          return (await response.json()) as ApiResponse<UserRow[]>;
        }),
        fetch(`${API_BASE_URL}/api/products`).then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          return (await response.json()) as ApiResponse<ProductRow[]>;
        }),
        fetch(`${API_BASE_URL}/orders`).then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          return (await response.json()) as ApiResponse<OrderRow[]>;
        }),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "vendor"),
      ]);

      const endedAt = performance.now();
      setApiLatencyMs(Math.round(endedAt - startedAt));

      const usersOk = usersRes.status === "fulfilled";
      const productsOk = productsRes.status === "fulfilled";
      const ordersOk = ordersRes.status === "fulfilled";
      setApiHealthy(usersOk && productsOk && ordersOk);

      if (usersOk) {
        setCustomers(usersRes.value.data || []);
      }

      if (productsOk) {
        setProducts(productsRes.value.data || []);
      }

      if (ordersOk) {
        setOrders(ordersRes.value.data || []);
      }

      if (vendorsRes.status === "fulfilled") {
        setVendorsCount(vendorsRes.value.count ?? 0);
      }

      setLastSyncedAt(new Date().toLocaleString());
      setLoading(false);
    };

    void loadDashboard();
  }, []);

  const pendingApprovals = useMemo(
    () => products.filter((product) => product.status === "pending").length,
    [products]
  );

  const activeCustomers = useMemo(
    () => customers.filter((customer) => customer.active !== false).length,
    [customers]
  );

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Customers"
          value={loading ? "..." : customers.length}
          icon={<Users className="h-4 w-4 text-foreground" />}
          trend={loading ? "Loading" : `${activeCustomers} active`}
        />
        <StatCard
          label="Total Products"
          value={loading ? "..." : products.length}
          icon={<Package className="h-4 w-4 text-foreground" />}
          trend={loading ? "Loading" : `${pendingApprovals} pending`}
        />
        <StatCard
          label="Total Orders"
          value={loading ? "..." : orders.length}
          icon={<ShoppingBag className="h-4 w-4 text-foreground" />}
          trend="From order table"
        />
        <StatCard
          label="Total Vendors"
          value={loading ? "..." : vendorsCount}
          icon={<Store className="h-4 w-4 text-foreground" />}
          trend="From profiles(role=vendor)"
        />
        <StatCard
          label="Pending Approvals"
          value={loading ? "..." : pendingApprovals}
          icon={<AlertCircle className="h-4 w-4 text-foreground" />}
          trend={pendingApprovals > 0 ? "Action needed" : "All clear"}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold mb-3">System Status</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Database/API</span><span className="font-medium text-foreground">{apiHealthy ? "Healthy" : "Partial"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">API Response</span><span className="font-medium text-foreground">{apiLatencyMs !== null ? `${apiLatencyMs}ms` : "-"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Last Sync</span><span className="font-medium">{lastSyncedAt || "-"}</span></div>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Pending product reviews</span><span className="bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-medium">{pendingApprovals} pending</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Inactive customers</span><span className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium">{Math.max(customers.length - activeCustomers, 0)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
