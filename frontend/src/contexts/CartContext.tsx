import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { CartItem, Product, MOCK_PRODUCTS } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

const API = "http://localhost:8080/api/cart";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getItemQty: (productId: string) => number;
  decreaseQty: (productId: string) => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);

  // ✅ GET USER FROM SUPABASE
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ FETCH CART FROM BACKEND (FIXED HERE)
  const refreshCart = async () => {
    if (!user?.id) return;

    try {
      const res = await axios.get(API, {
        params: { userId: user.id },
      });

      setItems(
        res.data.map((item: any) => {
          const product = MOCK_PRODUCTS.find(
            (p) => p.id === item.productId.toString()
          );

          return {
            product: {
              id: item.productId.toString(),
              name: item.productName,
              price: product?.price || 0,
              image: product?.image || "",
            },
            quantity: item.quantity,
          };
        })
      );
    } catch (err) {
      console.error("Fetch cart failed", err);
    }
  };

  // ✅ LOAD CART WHEN USER CHANGES
  useEffect(() => {
    if (user?.id) {
      refreshCart();
    }
  }, [user]);

  // ✅ ADD TO CART
  const addToCart = async (product: Product) => {
    if (!user?.id) {
      console.error("User not logged in");
      return;
    }

    try {
      await axios.post(API, null, {
        params: {
          userId: user.id,
          productId: product.id,
          productName: product.name,
          quantity: 1,
        },
      });

      await refreshCart();
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  // ✅ REMOVE ITEM
  const removeFromCart = async (productId: string) => {
    if (!user?.id) return;

    try {
      await axios.delete(API, {
        params: {
          userId: user.id,
          productId,
        },
      });

      await refreshCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  // ✅ UPDATE QUANTITY
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.id) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      await axios.put(API, null, {
        params: {
          userId: user.id,
          productId,
          quantity,
        },
      });

      await refreshCart();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ✅ DECREASE
  const decreaseQty = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return;

    updateQuantity(productId, item.quantity - 1);
  };

  const clearCart = () => setItems([]);

  const getItemQty = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        getItemQty,
        decreaseQty,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};