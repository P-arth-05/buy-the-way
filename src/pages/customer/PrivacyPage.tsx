export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-in fade-in duration-500 prose dark:prose-invert">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>At ESOMS, protecting your privacy and personal data is our top priority. This policy outlines how we collect, use, and protect your information.</p>
        <h2 className="text-2xl font-semibold text-foreground mt-8">1. Data Collection</h2>
        <p>We collect necessary information such as your name, email, shipping address, and order history to provide a seamless shopping experience and facilitate order fulfillment.</p>
        <h2 className="text-2xl font-semibold text-foreground mt-8">2. Secure Payments</h2>
        <p>All payment-related transactions are processed through secure third-party payment gateways. ESOMS does not directly store sensitive payment information such as credit card numbers on our servers.</p>
        <h2 className="text-2xl font-semibold text-foreground mt-8">3. Communication</h2>
        <p>We may use your email address or phone number to send automated system notifications regarding order confirmations, delivery updates, and refund acknowledgments.</p>
      </div>
    </div>
  );
}