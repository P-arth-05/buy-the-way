import { supabase } from "@/lib/supabase";

const API = "http://localhost:8080/api/orders";


const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("User not authenticated");
  }

  return token;
};

export const createOrder = async (data: {
  productId: number;
  quantity: number;
  email: string;
  fullName: string;
  address: string;
  city: string;
  pincode: string;
}) => {
  const token = await getToken();

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data), 
  });

  if (!res.ok) {
    throw new Error("Order failed");
  }

  return res.json();
};


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


export const returnOrder = async (orderId: number) => {
  const token = await getToken();

  const res = await fetch(`${API}/${orderId}/return`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Return failed");
  }

  return res.json();
};


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