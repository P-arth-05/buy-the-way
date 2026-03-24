import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, BarChart3, User, ChevronLeft, Tag, Gift, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  role: "vendor" | "admin";
}

const vendorLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/vendor" },
  { label: "Add Product", icon: Package, to: "/vendor/add-product" },
  { label: "Products", icon: ShoppingBag, to: "/vendor/products" },
  { label: "Inventory", icon: BarChart3, to: "/vendor/inventory" },
];

const adminLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Approvals", icon: Package, to: "/admin/approvals" },
  { label: "Vendors", icon: Store, to: "/admin/vendors" },
  { label: "Manage Categories", icon: Tag, to: "/admin/categories" },
  { label: "Reports", icon: BarChart3, to: "/admin/reports" },
];

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const location = useLocation();
  const links = role === "vendor" ? vendorLinks : adminLinks;
  const title = role === "vendor" ? "Vendor Panel" : "Admin Panel";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back to store</span>
          </Link>
        </div>
        <div className="px-6 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-lg font-semibold">{links.find(l => l.to === location.pathname)?.label || title}</h1>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
