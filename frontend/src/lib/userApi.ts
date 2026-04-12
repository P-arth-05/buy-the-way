export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface UserDTO {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  active?: boolean;
}

export interface CheckoutValidationResult {
  userId: number;
  valid: boolean;
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

export function createUser(payload: UserDTO) {
  return request<ApiResponse<UserDTO>>("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAllUsers() {
  return request<ApiResponse<UserDTO[]>>("/api/users");
}

export function getUserById(userId: number) {
  return request<ApiResponse<UserDTO>>(`/api/users/${userId}`);
}

export function getUserByEmail(email: string) {
  const query = new URLSearchParams({ email });
  return request<ApiResponse<UserDTO>>(`/api/users/by-email?${query.toString()}`);
}

export function updateUser(userId: number, payload: UserDTO) {
  return request<ApiResponse<UserDTO>>(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function setUserActiveStatus(userId: number, active: boolean) {
  const query = new URLSearchParams({ active: String(active) });
  return request<ApiResponse<UserDTO>>(`/api/users/${userId}/active?${query.toString()}`, {
    method: "PATCH",
  });
}

export function validateUserForCheckout(userId: number) {
  return request<ApiResponse<CheckoutValidationResult>>(
    `/api/users/${userId}/validate-checkout`
  );
}
