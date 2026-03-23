import { useState } from "react";
import { MOCK_PRODUCTS, CATEGORIES } from "@/data/mockData";
import ProductCard from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All"
    ? MOCK_PRODUCTS.filter(p => p.status === "approved")
    : MOCK_PRODUCTS.filter(p => p.status === "approved" && p.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <aside className="md:w-48 shrink-0 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Categories</h2>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "block w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200",
                selectedCategory === cat
                  ? "bg-secondary text-foreground font-medium shadow-soft"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <span className="text-sm text-muted-foreground">{filtered.length} items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
