export interface ApiResponse<T> {
  message: string;
  data: T;
}

export type ProductStatus = "pending" | "approved" | "rejected";

export interface ProductDTO {
  id?: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  status: ProductStatus;
  vendor: string;
  rating: number;
  reviews: number;
}

const API_BASE_URL =
  (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__ ||
  "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getAllProducts() {
  return request<ApiResponse<ProductDTO[]>>("/api/products");
}

export function getApprovedProducts() {
  return request<ApiResponse<ProductDTO[]>>("/api/products/approved");
}

export function getProductsByVendor(vendor: string) {
  return request<ApiResponse<ProductDTO[]>>(`/api/products/vendor/${encodeURIComponent(vendor)}`);
}

export function getProductById(productId: number) {
  return request<ApiResponse<ProductDTO>>(`/api/products/${productId}`);
}

export function createProduct(payload: Omit<ProductDTO, "id">) {
  return request<ApiResponse<ProductDTO>>("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(productId: number, payload: Omit<ProductDTO, "id">) {
  return request<ApiResponse<ProductDTO>>(`/api/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(productId: number) {
  return request<ApiResponse<null>>(`/api/products/${productId}`, {
    method: "DELETE",
  });
}

export function approveProduct(productId: number) {
  return request<ApiResponse<ProductDTO>>(`/api/products/${productId}/approve`, {
    method: "PATCH",
  });
}

export function rejectProduct(productId: number) {
  return request<ApiResponse<ProductDTO>>(`/api/products/${productId}/reject`, {
    method: "PATCH",
  });
}
