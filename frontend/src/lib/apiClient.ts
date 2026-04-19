// lib/apiClient.ts

const BASE_URL = "http://localhost:8080";

export const apiClient = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};