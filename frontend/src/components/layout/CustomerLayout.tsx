import { Outlet, Link } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* NEW: Updated E-Commerce Footer */}
      <footer className="bg-card border-t mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Buy the Way</h3>
            <p className="text-sm text-muted-foreground">
            The premier online marketplace connecting you with verified vendors for high-quality goods.
            </p>
          </div> 
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/order-tracking" className="hover:text-primary transition-colors">Track Order</Link></li>
                <li><Link to="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {/* Updated link and removed the Vendor option */}
                <li><Link to="/about" className="hover:text-primary transition-colors">About "Buy the Way"</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Buy the way. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;