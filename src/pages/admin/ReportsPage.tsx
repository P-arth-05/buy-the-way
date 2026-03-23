import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const salesData = [
  { month: "Jan", sales: 4200 },
  { month: "Feb", sales: 5800 },
  { month: "Mar", sales: 7200 },
  { month: "Apr", sales: 6100 },
  { month: "May", sales: 8900 },
  { month: "Jun", sales: 9400 },
];

const orderData = [
  { month: "Jan", orders: 120 },
  { month: "Feb", orders: 180 },
  { month: "Mar", orders: 240 },
  { month: "Apr", orders: 190 },
  { month: "May", orders: 310 },
  { month: "Jun", orders: 280 },
];

const ReportsPage = () => (
  <div className="space-y-8">
    <h2 className="text-xl font-bold">Reports</h2>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h3 className="font-semibold mb-4">Sales Revenue</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 15% 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }} />
            <Line type="monotone" dataKey="sales" stroke="hsl(5 76% 64%)" strokeWidth={2} dot={{ fill: "hsl(5 76% 64%)", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h3 className="font-semibold mb-4">Order Volume</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={orderData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 15% 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(193 20% 40%)" />
            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }} />
            <Bar dataKey="orders" fill="hsl(200 52% 88%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default ReportsPage;
