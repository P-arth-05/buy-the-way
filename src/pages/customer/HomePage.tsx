import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MOCK_PRODUCTS, CATEGORIES } from "@/data/mockData";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";


export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("search") || "").toLowerCase();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([5000]); 
  const [minRating, setMinRating] = useState(0); // NEW: Rating State
  
  const brands = Array.from(new Set(MOCK_PRODUCTS.map(p => p.vendor)));
  const [selectedBrand, setSelectedBrand] = useState("All");

  const approvedProducts = MOCK_PRODUCTS.filter((product) => product.status === "approved");

  // Apply All Filters (including Search & Rating)
  const displayedProducts = approvedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery) || product.description.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || product.vendor === selectedBrand;
    const matchesPrice = product.price <= priceRange[0];
    const matchesRating = (product.rating || 0) >= minRating;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {searchQuery && (
        <h2 className="text-2xl font-bold mb-6">Search results for "{searchQuery}"</h2>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Filters</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <Label className="text-base font-semibold">Category</Label>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.map((category) => (
                    <Button key={category} variant={selectedCategory === category ? "default" : "ghost"} className="justify-start h-8 px-2" onClick={() => setSelectedCategory(category)}>
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Max Price</Label>
                  <span className="text-sm font-medium">₹{priceRange[0]}</span>
                </div>
                <Slider defaultValue={[5000]} max={5000} step={100} onValueChange={setPriceRange} />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Brand / Vendor</Label>
                <select className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  <option value="All">All Brands</option>
                  {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>

              {/* NEW: Rating Filter */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Min. Rating</Label>
                <div className="flex flex-col gap-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <Button key={rating} variant={minRating === rating ? "secondary" : "ghost"} className="justify-start h-8 px-2 gap-2" onClick={() => setMinRating(minRating === rating ? 0 : rating)}>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {rating} & Up
                    </Button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="text-center py-20 border rounded-lg bg-muted/10">
              <h2 className="text-2xl font-semibold mb-2">No products found</h2>
              <Button variant="outline" className="mt-4" onClick={() => { setSelectedCategory("All"); setSelectedBrand("All"); setPriceRange([5000]); setMinRating(0); navigate('/'); }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}