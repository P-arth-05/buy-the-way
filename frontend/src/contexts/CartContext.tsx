import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartItem, Product, MOCK_PRODUCTS } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const API = "http://localhost:8080/api/cart";

// ✅ Always fetches a fresh token from Supabase session — no localStorage race condition
const getAuthHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

  // ✅ Use AuthContext as the single source of truth for the user
  const { user, loading } = useAuth();

  // ✅ Fetch cart from backend
  const refreshCart = async () => {
    if (!user?.id) return;

    try {
      const headers = await getAuthHeaders();

      const res = await axios.get(API, {
        params: { userId: user.id },
        headers,
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

  // ✅ Load cart whenever the authenticated user changes
  // No duplicate Supabase listener — AuthContext handles all auth events
// ✅ Load cart only after AuthContext has fully settled

useEffect(() => {
    if (!loading && user?.id) {
      refreshCart();
    } else if (!loading && !user?.id) {
      setItems([]);
    }
  }, [user?.id, loading]);

  // ✅ Add to cart
  const addToCart = async (product: Product) => {
    if (!user?.id) {
      console.error("User not logged in");
      return;
    }

    try {
      const headers = await getAuthHeaders();

      await axios.post(API, null, {
        params: {
          userId: user.id,
          productId: product.id,
          productName: product.name,
          quantity: 1,
        },
        headers,
      });

      await refreshCart();
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  // ✅ Remove item
  const removeFromCart = async (productId: string) => {
    if (!user?.id) return;

    try {
      const headers = await getAuthHeaders();

      await axios.delete(API, {
        params: {
          userId: user.id,
          productId,
        },
        headers,
      });

      await refreshCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.id) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      const headers = await getAuthHeaders();

      await axios.put(API, null, {
        params: {
          userId: user.id,
          productId,
          quantity,
        },
        headers,
      });

      await refreshCart();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ✅ Decrease quantity by 1
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