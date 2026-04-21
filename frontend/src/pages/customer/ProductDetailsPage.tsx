import { useParams, useNavigate } from "react-router-dom";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Store } from "lucide-react";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, decreaseQty, getItemQty } = useCart();

  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => navigate("/shop")}>Return to shop</Button>
      </div>
    );
  }

  const cartQty = getItemQty(product.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate("/shop")}
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

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <p className="text-3xl font-bold text-primary mb-6">
              ₹{product.price.toFixed(2)}
            </p>

            <p className="text-lg text-muted-foreground mb-8">
              {product.description}
            </p>
          </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}