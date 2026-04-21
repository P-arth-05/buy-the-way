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

interface CustomerProfileRow {
  id: string;
  name: string | null;
}

interface ProductRow {
  id: number;
  status: "pending" | "approved" | "rejected";
  name?: string;
  category?: string;
  vendor?: string;
}

interface OrderRow {
  id: number;
  productId: number;
  userId: string;
  quantity: number;
  totalPrice: number;
  status: string;
}

const API_BASE_URL =
  (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__ ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const buildApiBaseCandidates = () => {
  const sameOrigin = window.location.origin;
  const shouldTrySameOriginApi = !sameOrigin.includes(":8081");
  const candidates = [
    API_BASE_URL,
    shouldTrySameOriginApi ? sameOrigin : null,
    "http://localhost:8080",
  ].filter(Boolean);

  return [...new Set(candidates.map((candidate) => String(candidate).replace(/\/$/, "")))];
};

const requestFromApiCandidates = async <T,>(path: string, init?: RequestInit): Promise<ApiResponse<T>> => {
  const apiBaseCandidates = buildApiBaseCandidates();
  const failures: string[] = [];

  for (const apiBase of apiBaseCandidates) {
    try {
      const response = await fetch(`${apiBase}${path}`, {
        ...init,
        headers: {
          Accept: "application/json",
          ...(init?.headers || {}),
        },
      });

      if (!response.ok) {
        failures.push(`HTTP ${response.status} from ${apiBase}`);
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        failures.push(`Non-JSON response from ${apiBase}`);
        continue;
      }

      return (await response.json()) as ApiResponse<T>;
    } catch {
      failures.push(`Network error while connecting to ${apiBase}`);
    }
  }

  const details = failures.length > 0 ? ` (${failures.join("; ")})` : "";
  throw new Error(`Unable to reach backend API${details}`);
};

const formatCurrency = (value: number) =>
  `Rs. ${Number.isFinite(value) ? value.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0"}`;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [apiHealthy, setApiHealthy] = useState(false);
  const [apiLatencyMs, setApiLatencyMs] = useState<number | null>(null);
  const [customers, setCustomers] = useState<UserRow[]>([]);
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfileRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [vendorsCount, setVendorsCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setDashboardError("");
      const startedAt = performance.now();

      const [usersRes, productCountRes, productsRes, orderCountRes, ordersRes, vendorsRes, customersRes] = await Promise.allSettled([
        requestFromApiCandidates<UserRow[]>("/api/users"),
        requestFromApiCandidates<number>("/api/products/count"),
        requestFromApiCandidates<ProductRow[]>("/api/products"),
        requestFromApiCandidates<number>("/api/orders/count"),
        requestFromApiCandidates<OrderRow[]>("/api/orders"),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "vendor"),
        supabase
          .from("profiles")
          .select("id,name")
          .eq("role", "customer"),
      ]);

      const endedAt = performance.now();
      setApiLatencyMs(Math.round(endedAt - startedAt));

      const usersOk = usersRes.status === "fulfilled";
      const productCountOk = productCountRes.status === "fulfilled";
      const productsOk = productsRes.status === "fulfilled";
      const orderCountOk = orderCountRes.status === "fulfilled";
      const ordersOk = ordersRes.status === "fulfilled";
      setApiHealthy(productCountOk && productsOk && orderCountOk && ordersOk);

      if (!productCountOk || !productsOk || !orderCountOk || !ordersOk) {
        const firstFailure = [productCountRes, productsRes, orderCountRes, ordersRes].find(
          (result) => result.status === "rejected"
        );

        if (firstFailure?.status === "rejected") {
          setDashboardError(firstFailure.reason instanceof Error ? firstFailure.reason.message : "Failed to fetch dashboard data");
        }
      }

      if (usersOk) {
        setCustomers(usersRes.value.data || []);
      } else if (customersRes.status === "fulfilled") {
        const fallbackCustomers = Array.from(
          { length: customersRes.value.count ?? 0 },
          (_, index) => ({ id: index + 1, active: true })
        );
        setCustomers(fallbackCustomers);
      } else {
        setCustomers([]);
      }

      if (productCountOk) {
        setProductCount(productCountRes.value.data || 0);
      }

      if (productsOk) {
        setProducts(productsRes.value.data || []);
      }

      if (orderCountOk) {
        setOrderCount(orderCountRes.value.data || 0);
      }

      if (ordersOk) {
        setOrders(ordersRes.value.data || []);
      }

      if (vendorsRes.status === "fulfilled") {
        setVendorsCount(vendorsRes.value.count ?? 0);
      } else {
        setVendorsCount(0);
      }

      if (customersRes.status === "fulfilled") {
        setCustomerProfiles((customersRes.value.data || []) as CustomerProfileRow[]);
      } else {
        setCustomerProfiles([]);
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

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const customerNameMap = useMemo(
    () => new Map(customerProfiles.map((customer) => [customer.id, customer.name?.trim() || null])),
    [customerProfiles]
  );

  const salesByProduct = useMemo(() => {
    const aggregates = new Map<number, { name: string; orders: number; units: number; revenue: number }>();

    orders.forEach((order) => {
      const existing = aggregates.get(order.productId);
      const productName = productMap.get(order.productId)?.name || `Product #${order.productId}`;
      const revenue = Number(order.totalPrice || 0);
      const units = Number(order.quantity || 0);

      if (!existing) {
        aggregates.set(order.productId, {
          name: productName,
          orders: 1,
          units,
          revenue,
        });
        return;
      }

      existing.orders += 1;
      existing.units += units;
      existing.revenue += revenue;
    });

    return Array.from(aggregates.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders, productMap]);

  const salesByCategory = useMemo(() => {
    const aggregates = new Map<string, { category: string; orders: number; revenue: number }>();

    orders.forEach((order) => {
      const category = productMap.get(order.productId)?.category || "Uncategorized";
      const existing = aggregates.get(category);
      const revenue = Number(order.totalPrice || 0);

      if (!existing) {
        aggregates.set(category, { category, orders: 1, revenue });
        return;
      }

      existing.orders += 1;
      existing.revenue += revenue;
    });

    return Array.from(aggregates.values()).sort((a, b) => b.revenue - a.revenue);
  }, [orders, productMap]);

  const salesByVendor = useMemo(() => {
    const aggregates = new Map<string, { vendor: string; orders: number; revenue: number }>();

    orders.forEach((order) => {
      const vendor = productMap.get(order.productId)?.vendor || "Unknown vendor";
      const existing = aggregates.get(vendor);
      const revenue = Number(order.totalPrice || 0);

      if (!existing) {
        aggregates.set(vendor, { vendor, orders: 1, revenue });
        return;
      }

      existing.orders += 1;
      existing.revenue += revenue;
    });

    return Array.from(aggregates.values()).sort((a, b) => b.revenue - a.revenue);
  }, [orders, productMap]);

  const customerLoyalty = useMemo(() => {
    const byCustomer = new Map<string, { customerId: string; orders: number; spend: number }>();

    orders.forEach((order) => {
      const customerId = order.userId || "Unknown";
      const existing = byCustomer.get(customerId);
      const spend = Number(order.totalPrice || 0);

      if (!existing) {
        byCustomer.set(customerId, { customerId, orders: 1, spend });
        return;
      }

      existing.orders += 1;
      existing.spend += spend;
    });

    const customersList = Array.from(byCustomer.values());
    const totalCustomers = customersList.length;
    const repeatCustomers = customersList.filter((entry) => entry.orders > 1).length;
    const oneTimeCustomers = customersList.filter((entry) => entry.orders === 1).length;
    const avgOrdersPerCustomer = totalCustomers > 0 ? orders.length / totalCustomers : 0;

    return {
      totalCustomers,
      repeatCustomers,
      oneTimeCustomers,
      avgOrdersPerCustomer,
      repeatRate: totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0,
      topLoyalCustomers: customersList.sort((a, b) => b.orders - a.orders).slice(0, 5),
    };
  }, [orders]);

  const getCustomerDisplayName = (customerId: string) => {
    const profileName = customerNameMap.get(customerId);

    if (profileName) {
      return profileName;
    }

    if (customerId === "Unknown") {
      return "Unknown customer";
    }

    return `Customer ${customerId.slice(0, 8)}`;
  };

  const refundAnalysis = useMemo(() => {
    const refundedOrders = orders.filter(
      (order) => order.status === "RETURNED" || order.status === "CANCELLED"
    );
    const grossRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    const refundedAmount = refundedOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    const netRevenue = grossRevenue - refundedAmount;

    return {
      grossRevenue,
      refundedAmount,
      netRevenue,
      refundedOrders: refundedOrders.length,
      refundRate: orders.length > 0 ? (refundedOrders.length / orders.length) * 100 : 0,
    };
  }, [orders]);

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
          value={loading ? "..." : productCount}
          icon={<Package className="h-4 w-4 text-foreground" />}
          trend={loading ? "Loading" : `${pendingApprovals} pending`}
        />
        <StatCard
          label="Total Orders"
          value={loading ? "..." : orderCount}
          icon={<ShoppingBag className="h-4 w-4 text-foreground" />}
          trend="From order count"
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

      {dashboardError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Unable to refresh some database reports: {dashboardError}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold mb-4">Sales by Product</h2>
          <div className="space-y-3 text-sm">
            {salesByProduct.length > 0 ? (
              salesByProduct.map((entry) => (
                <div key={entry.name} className="flex justify-between gap-3">
                  <span className="text-muted-foreground truncate">{entry.name}</span>
                  <span className="font-medium text-right">
                    {formatCurrency(entry.revenue)} ({entry.units} units)
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No product sales data available.</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold mb-4">Sales by Category</h2>
          <div className="space-y-3 text-sm max-h-72 overflow-auto pr-1">
            {salesByCategory.length > 0 ? (
              salesByCategory.map((entry) => (
                <div key={entry.category} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{entry.category}</span>
                  <span className="font-medium text-right">{formatCurrency(entry.revenue)}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No category sales data available.</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold mb-4">Sales by Vendor</h2>
          <div className="space-y-3 text-sm max-h-72 overflow-auto pr-1">
            {salesByVendor.length > 0 ? (
              salesByVendor.map((entry) => (
                <div key={entry.vendor} className="flex justify-between gap-3">
                  <span className="text-muted-foreground truncate">{entry.vendor}</span>
                  <span className="font-medium text-right">{formatCurrency(entry.revenue)}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No vendor sales data available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-2xl shadow-soft p-6 space-y-4">
          <h2 className="font-semibold">Customer Purchase Patterns & Loyalty</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-muted-foreground">Repeat Customer Rate</p>
              <p className="text-lg font-semibold">{formatPercent(customerLoyalty.repeatRate)}</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-muted-foreground">Avg Orders per Customer</p>
              <p className="text-lg font-semibold">{customerLoyalty.avgOrdersPerCustomer.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-muted-foreground">One-time Customers</p>
              <p className="text-lg font-semibold">{customerLoyalty.oneTimeCustomers}</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-muted-foreground">Repeat Customers</p>
              <p className="text-lg font-semibold">{customerLoyalty.repeatCustomers}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-sm">Top Loyal Customers</h3>
            <div className="space-y-2 text-sm">
              {customerLoyalty.topLoyalCustomers.length > 0 ? (
                customerLoyalty.topLoyalCustomers.map((entry) => (
                  <div key={entry.customerId} className="flex justify-between gap-3">
                    <span className="text-muted-foreground truncate">{getCustomerDisplayName(entry.customerId)}</span>
                    <span className="font-medium">{entry.orders} orders</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No customer order pattern available yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-6 space-y-4">
          <h2 className="font-semibold">Revenue vs Refund Analysis</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-muted-foreground">Gross Revenue</p>
              <p className="text-lg font-semibold">{formatCurrency(refundAnalysis.grossRevenue)}</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-muted-foreground">Refunded Amount</p>
              <p className="text-lg font-semibold">{formatCurrency(refundAnalysis.refundedAmount)}</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-muted-foreground">Net Revenue</p>
              <p className="text-lg font-semibold">{formatCurrency(refundAnalysis.netRevenue)}</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-muted-foreground">Refund Rate</p>
              <p className="text-lg font-semibold">{formatPercent(refundAnalysis.refundRate)}</p>
              <p className="text-xs text-muted-foreground">
                {refundAnalysis.refundedOrders} refunded/cancelled orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
