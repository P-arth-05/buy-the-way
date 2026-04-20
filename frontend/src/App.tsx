import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { ProductWorkflowProvider } from "@/contexts/ProductWorkflowContext";
import { AuthProvider } from "@/contexts/AuthContext";          // ← ADD
import ProtectedRoute from "@/components/ProtectedRoute";      // ← ADD
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
import VendorOrderTrackingPage from "@/pages/vendor/VendorOrderTrackingPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ApprovalsPage from "@/pages/admin/ApprovalsPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import DiscountsPage from "@/pages/admin/DiscountsPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import VendorsPage from "@/pages/admin/VendorsPage";
import NotFound from "@/pages/NotFound";
import OrderHistoryPage from "@/pages/customer/OrderHistoryPage";
import AboutPage from "@/pages/customer/AboutPage";
import ProfilePage from "@/pages/customer/ProfilePage";
import FAQPage from "@/pages/customer/FAQPage";
import ReturnsPage from "@/pages/customer/ReturnsPage";
import TermsPage from "@/pages/customer/TermsPage";
import PrivacyPage from "@/pages/customer/PrivacyPage";
import Landing from "@/pages/LandingPage/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/CustomerRegister";
import VendorRegister from "@/pages/VendorRegister";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <ProductWorkflowProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>  {/* ← MOVED inside BrowserRouter (needed for useNavigate) */}
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/vendor-register" element={<VendorRegister />} />

                {/* Customer routes — customers + guests can access */}
                <Route element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <CustomerLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/shop" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-tracking" element={<OrderTrackingPage />} />
                  <Route path="/order-history" element={<OrderHistoryPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/returns" element={<ReturnsPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                </Route>

                {/* Vendor routes */}
                <Route element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <DashboardLayout role="vendor" />
                  </ProtectedRoute>
                }>
                  <Route path="/vendor" element={<VendorDashboard />} />
                  <Route path="/vendor/add-product" element={<AddProductPage />} />
                  <Route path="/vendor/products" element={<VendorProductsPage />} />
                  <Route path="/vendor/inventory" element={<InventoryPage />} />
                </Route>

                {/* Admin routes */}
                <Route element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout role="admin" />
                  </ProtectedRoute>
                }>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/approvals" element={<ApprovalsPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                  <Route path="/admin/categories" element={<CategoriesPage />} />
                  <Route path="/admin/vendors" element={<VendorsPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ProductWorkflowProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;