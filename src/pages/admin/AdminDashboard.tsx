import StatCard from "@/components/shared/StatCard";
import { Users, Package, ShoppingBag, AlertCircle } from "lucide-react";

const AdminDashboard = () => (
  <div className="space-y-8">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard label="Total Users" value={1284} icon={<Users className="h-4 w-4 text-foreground" />} trend="+48 this week" />
      <StatCard label="Total Products" value={342} icon={<Package className="h-4 w-4 text-foreground" />} trend="12 pending" />
      <StatCard label="Total Orders" value={2841} icon={<ShoppingBag className="h-4 w-4 text-foreground" />} trend="+156 this week" />
      <StatCard label="Pending Approvals" value={5} icon={<AlertCircle className="h-4 w-4 text-foreground" />} trend="Action needed" />
    </div>

    <div className="grid sm:grid-cols-2 gap-5">
      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h2 className="font-semibold mb-3">System Status</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Database</span><span className="font-medium text-foreground">Healthy</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">API Response</span><span className="font-medium text-foreground">42ms</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span className="font-medium">99.98%</span></div>
        </div>
      </div>
      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h2 className="font-semibold mb-3">Quick Actions</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center"><span className="text-muted-foreground">Pending product reviews</span><span className="bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-medium">5 new</span></div>
          <div className="flex justify-between items-center"><span className="text-muted-foreground">Support tickets</span><span className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium">3 open</span></div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
