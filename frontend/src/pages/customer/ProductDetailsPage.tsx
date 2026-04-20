import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, ProductDTO } from "@/lib/productApi";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Store } from "lucide-react";

type Product = ProductDTO & { id: string };

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, decreaseQty, getItemQty } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  //Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await getProductById(Number(id));

        setProduct({
          ...response.data,
          id: String(response.data.id),
        });
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-medium">Loading product...</h2>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }

  const cartQty = getItemQty(product.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
<<<<<<< HEAD
        onClick={() => navigate("/shop")}
=======
        onClick={() => navigate("/")}
>>>>>>> suhani-updates
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Badge>{product.category}</Badge>
              <span className="flex items-center text-sm text-muted-foreground gap-1">
                <Store className="h-4 w-4" /> {product.vendor}
              </span>
            </div>

<<<<<<< HEAD
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>
=======
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
>>>>>>> suhani-updates

            <p className="text-3xl font-bold text-primary mb-6">
              ₹{product.price.toFixed(2)}
            </p>

<<<<<<< HEAD
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
=======
            <p className="text-lg text-muted-foreground mb-8">
>>>>>>> suhani-updates
              {product.description}
            </p>
          </div>

<<<<<<< HEAD
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <span className="font-medium">Availability</span>
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-destructive font-medium">
                  Out of stock
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <Button
              size="lg"
              className="w-full text-lg h-14 gap-2"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
=======
          {/* ✅ DYNAMIC CART UI */}
          <div className="mt-auto">
            {cartQty === 0 ? (
              <Button
                size="lg"
                className="w-full h-14"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                {/* QUANTITY */}
                <div className="flex items-center border rounded-full px-4 py-2 gap-4">
                  <button
                    onClick={() => decreaseQty(product.id)}
                    className="text-xl"
                  >
                    -
                  </button>

                  <span className="text-lg">{cartQty}</span>

                  <button
                    onClick={() => addToCart(product)}
                    className="text-xl"
                  >
                    +
                  </button>
                </div>

                {/* GO TO CART */}
                <Button onClick={() => navigate("/cart")}>
                  Go to Cart
                </Button>
              </div>
            )}
>>>>>>> suhani-updates
          </div>
        </div>
      </div>
    </div>
  );
}