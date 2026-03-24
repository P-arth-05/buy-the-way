import { Product } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react"; // Imported Star
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductCardProps { product: Product; }

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
          <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm">{product.category}</Badge>
        </div>
        
        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <span className="font-bold whitespace-nowrap">INR{product.price.toFixed(2)}</span>
          </div>
          {/* NEW: Ratings display */}
          <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
          <p className="text-xs text-muted-foreground">Sold by: <span className="font-medium">{product.vendor}</span></p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full gap-2" disabled={product.stock === 0} variant={product.stock === 0 ? "secondary" : "default"}>
            <ShoppingCart className="h-4 w-4" /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}