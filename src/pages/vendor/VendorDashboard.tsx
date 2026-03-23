import StatCard from "@/components/shared/StatCard";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Jan", orders: 12 },
  { month: "Feb", orders: 19 },
  { month: "Mar", orders: 27 },
  { month: "Apr", orders: 22 },
  { month: "May", orders: 35 },
  { month: "Jun", orders: 30 },
];

const VendorDashboard = () => (
  <div className="space-y-8">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard label="Total Products" value={8} icon={<Package className="h-4 w-4 text-foreground" />} trend="+2 this month" />
      <StatCard label="Total Orders" value={145} icon={<ShoppingBag className="h-4 w-4 text-foreground" />} trend="+12 this week" />
      <StatCard label="Revenue" value="$8,420" icon={<DollarSign className="h-4 w-4 text-foreground" />} trend="+18% vs last month" />
      <StatCard label="Growth" value="24%" icon={<TrendingUp className="h-4 w-4 text-foreground" />} trend="Trending up" />
    </div>

    <div className="bg-card rounded-2xl shadow-soft p-6">
      <h2 className="font-semibold mb-4">Monthly Orders</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 15% 88%)" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }} />
          <Bar dataKey="orders" fill="hsl(200 52% 88%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default VendorDashboard;
