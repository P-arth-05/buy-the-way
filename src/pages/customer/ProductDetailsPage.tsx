import { useParams, Link } from "react-router-dom";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button variant="soft" className="mt-4" asChild><Link to="/">Go back</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
        </div>

        <div className="space-y-6 py-4">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.category}</span>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          </div>
          <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <Button size="lg" onClick={() => addToCart(product)} className="w-full md:w-auto">
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
