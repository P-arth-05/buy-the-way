import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface OrderReportRow {
  createdAt: string;
  totalPrice: number;
}

interface MonthlyReportRow {
  month: string;
  sales: number;
  orders: number;
}

const API_BASE_URL =
  (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__ ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const buildApiBaseCandidates = () => {
  const candidates = [
    API_BASE_URL,
    window.location.origin,
    "http://localhost:8080",
    "http://localhost:8081",
  ].filter(Boolean);

  return [...new Set(candidates)];
};

const requestFromApiCandidates = async <T,>(path: string, init?: RequestInit): Promise<ApiResponse<T>> => {
  const apiBaseCandidates = buildApiBaseCandidates();
  let lastError = "Failed to fetch from all API URLs.";

  for (const apiBase of apiBaseCandidates) {
    try {
      const response = await fetch(`${apiBase}${path}`, init);

      if (!response.ok) {
        const responseText = await response.text();
        lastError = responseText || `Request failed from ${apiBase} (${response.status})`;
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        lastError = `Non-JSON response from ${apiBase}`;
        continue;
      }

      return (await response.json()) as ApiResponse<T>;
    } catch {
      lastError = `Network error while connecting to ${apiBase}`;
    }
  }

  throw new Error(lastError);
};

const formatMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" }).format(date);

const buildMonthlyReport = (orders: OrderReportRow[]): MonthlyReportRow[] => {
  const now = new Date();
  const monthlyBuckets = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

    return {
      monthKey,
      month: formatMonthLabel(monthDate),
      sales: 0,
      orders: 0,
    };
  });

  const bucketByKey = new Map(monthlyBuckets.map((bucket) => [bucket.monthKey, bucket]));

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);

    if (Number.isNaN(orderDate.getTime())) {
      return;
    }

    const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
    const bucket = bucketByKey.get(monthKey);

    if (!bucket) {
      return;
    }

    bucket.sales += Number(order.totalPrice || 0);
    bucket.orders += 1;
  });

  return monthlyBuckets;
};

const ReportsPage = () => {
  const [orders, setOrders] = useState<OrderReportRow[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const loadReports = async () => {
    setLoadingReports(true);
    setReportsError("");

    try {
      const payload = await requestFromApiCandidates<OrderReportRow[]>("/api/orders/reports");
      setOrders(payload.data || []);
    } catch (fetchError) {
      setOrders([]);
      setReportsError(fetchError instanceof Error ? fetchError.message : "Failed to load reports");
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      void loadReports();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = useMemo(() => buildMonthlyReport(orders), [orders]);
  const hasData = chartData.some((entry) => entry.sales > 0 || entry.orders > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Reports</h2>
          <p className="text-sm text-muted-foreground">
            {loadingReports ? "Loading database-backed report data..." : "Monthly metrics from stored orders"}
          </p>
        </div>
        {reportsError ? <span className="text-sm text-destructive">{reportsError}</span> : null}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h3 className="font-semibold mb-4">Sales Revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 15% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
              <Tooltip
                formatter={(value: number) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="hsl(5 76% 64%)"
                strokeWidth={2}
                dot={{ fill: "hsl(5 76% 64%)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {!hasData && !loadingReports ? <p className="mt-3 text-sm text-muted-foreground">No order data found yet.</p> : null}
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h3 className="font-semibold mb-4">Order Volume</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 15% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
              <Tooltip
                formatter={(value: number) => [Number(value).toLocaleString("en-IN"), "Orders"]}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              />
              <Bar dataKey="orders" fill="hsl(200 52% 88%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {!hasData && !loadingReports ? <p className="mt-3 text-sm text-muted-foreground">No order data found yet.</p> : null}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
