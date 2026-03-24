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
import CategoriesPage from "@/pages/admin/CategoriesPage";
import VendorsPage from "@/pages/admin/VendorsPage";
import NotFound from "@/pages/NotFound";
// Add this near your other customer page imports
import OrderHistoryPage from "@/pages/customer/OrderHistoryPage";
import AboutPage from "@/pages/customer/AboutPage";
import FAQPage from "@/pages/customer/FAQPage";
import ReturnsPage from "@/pages/customer/ReturnsPage";
import TermsPage from "@/pages/customer/TermsPage";
import PrivacyPage from "@/pages/customer/PrivacyPage";
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
              <Route path="/order-history" element={<OrderHistoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
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
              <Route path="/admin/categories" element={<CategoriesPage />} />
              <Route path="/admin/vendors" element={<VendorsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
