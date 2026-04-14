import { supabase } from "@/lib/supabase";

const API = "http://localhost:8080/api/orders";

// 🔐 helper to get access token
const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  return token;
};

// ✅ CREATE ORDER (UPDATED — email added)
export const createOrder = async (
  productId: number,
  quantity: number,
  email: string
) => {
  const token = await getToken();

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
      email, // ✅ NEW
    }),
  });

  if (!res.ok) {
    throw new Error("Order failed");
  }

  return res.json();
};

// ✅ GET MY ORDERS
export const getMyOrders = async () => {
  const token = await getToken();

  const res = await fetch(`${API}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
};

// ✅ CANCEL ORDER
export const cancelOrder = async (orderId: number) => {
  const token = await getToken();

  const res = await fetch(`${API}/${orderId}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Cancel failed");
  }

  return res.json();
};

// ✅ GET ORDER BY ID
export const getOrderById = async (orderId: number) => {
  const token = await getToken();

  const res = await fetch(`${API}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Order not found");
  }

  return res.json();
};