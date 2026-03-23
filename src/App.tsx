import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import CustomerLayout from "@/components/layout/CustomerLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HomePage from "@/pages/customer/HomePage";
import ProductDetailsPage from "@/pages/customer/ProductDetailsPage";
import CartPage from "@/pages/customer/CartPage";
import CheckoutPage from "@/pages/customer/CheckoutPage";
import OrderTrackingPage from "@/pages/customer/OrderTrackingPage";
import VendorDashboard from "@/pages/vendor/VendorDashboard";
import AddProductPage from "@/pages/vendor/AddProductPage";
import VendorProductsPage from "@/pages/vendor/VendorProductsPage";
import InventoryPage from "@/pages/vendor/InventoryPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ApprovalsPage from "@/pages/admin/ApprovalsPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Customer routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-tracking" element={<OrderTrackingPage />} />
            </Route>

            {/* Vendor routes */}
            <Route element={<DashboardLayout role="vendor" />}>
              <Route path="/vendor" element={<VendorDashboard />} />
              <Route path="/vendor/add-product" element={<AddProductPage />} />
              <Route path="/vendor/products" element={<VendorProductsPage />} />
              <Route path="/vendor/inventory" element={<InventoryPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<DashboardLayout role="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/approvals" element={<ApprovalsPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
