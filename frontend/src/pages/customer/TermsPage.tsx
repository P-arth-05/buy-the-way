export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-in fade-in duration-500 prose dark:prose-invert">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Welcome to the E-Commerce Storefront and Order Management System (ESOMS). By accessing our platform, you agree to be bound by these terms.</p>
        <h2 className="text-2xl font-semibold text-foreground mt-8">1. Account Responsibilities</h2>
        <p>Customers must be registered on the platform to place orders. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
        <h2 className="text-2xl font-semibold text-foreground mt-8">2. Order Processing</h2>
        <p>All orders are subject to product availability. We reserve the right to cancel or refuse any order. In the event of an order cancellation, any processed payments will be refunded in full.</p>
        <h2 className="text-2xl font-semibold text-foreground mt-8">3. Vendor Interactions</h2>
        <p>Products on ESOMS are sold by independent, approved vendors. While we facilitate the transaction and manage the platform, the respective vendors are responsible for the quality and fulfillment of their products.</p>
      </div>
    </div>
  );
}