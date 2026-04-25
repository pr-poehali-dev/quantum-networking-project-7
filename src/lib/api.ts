import func2url from "../../backend/func2url.json";

const AUTH_URL = func2url.auth;
const ORDERS_URL = func2url.orders;
const LOYALTY_URL = func2url.loyalty;

const TOKEN_KEY = "apple_service_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

// Auth
export async function apiRegister(name: string, email: string, password: string, phone?: string) {
  return request(`${AUTH_URL}?action=register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
}

export async function apiLogin(email: string, password: string) {
  const data = await request(`${AUTH_URL}?action=login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.token) setToken(data.token);
  return data;
}

export async function apiLogout() {
  await request(`${AUTH_URL}?action=logout`, { method: "POST" });
  removeToken();
}

export async function apiGetMe() {
  return request(`${AUTH_URL}?action=me`);
}

export async function apiUpdateProfile(name: string, phone: string) {
  return request(`${AUTH_URL}?action=update-profile`, {
    method: "PUT",
    body: JSON.stringify({ name, phone }),
  });
}

// Orders
export async function apiSearchOrder(number: string) {
  return request(`${ORDERS_URL}?action=search&number=${encodeURIComponent(number)}`);
}

export async function apiGetMyOrders() {
  return request(`${ORDERS_URL}?action=list`);
}

// Loyalty
export async function apiGetLoyalty() {
  return request(`${LOYALTY_URL}`);
}
