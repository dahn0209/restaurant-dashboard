const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  health: () => get("/health"),
  overview: () => get("/overview"),
  restaurants: () => get("/restaurants"),
  monthly: () => get("/monthly"),
  paymentMethods: () => get("/payment-methods"),
  mealTypes: () => get("/meal-types"),
  topServers: () => get("/servers/top"),
  loyalty: () => get("/loyalty"),
};

export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function money(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function int(n) {
  return Number(n || 0).toLocaleString("en-US");
}
