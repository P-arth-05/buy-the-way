import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";

export default function Navbar() {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setShowSearch(false); // collapse after search
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* LEFT: LOGO */}
        <Link to="/" className="font-bold text-xl tracking-tight text-primary">
          Buy the Way
        </Link>

        {/* CENTER: NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6 text-md font-medium">
          <Link to="/shop" className="hover:text-primary transition">
            Customer
          </Link>
          <Link to="/admin" className="hover:text-primary transition">
            Admin
          </Link>
          <Link to="/vendor" className="hover:text-primary transition">
            Vendor
          </Link>
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">


          {/* LOGIN / REGISTER */}
          <Link to="/login">
            <Button variant="outline" className="rounded-full px-4">
              Login / Register
            </Button>
          </Link>
        </div>
      </div>

      {/* COLLAPSIBLE SEARCH BAR */}
      {showSearch && (
        <div className="w-full border-t px-4 py-3 bg-background">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <Input
              type="search"
              placeholder="Search products..."
              className="flex-1 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="rounded-full px-6">
              Search
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}