import { Locale } from "./i18n/translations";

// Empty by default: requests go through Next.js's own /api rewrite (see
// next.config.ts) so the browser always calls same-origin, never the backend
// directly — set NEXT_PUBLIC_API_URL only to bypass the proxy.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function buildUrl(path: string): URL {
  const base = API_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  return new URL(path, base);
}

export interface ProductSummary {
  code: string;
  name: string | null;
  brand: string | null;
  imageUrl: string | null;
  quantity: string | null;
}

export interface ProductDetail extends ProductSummary {
  ingredientsText: string | null;
  nutriments: Record<string, number | null> | null;
  nutriScore: string | null;
  novaGroup: number | null;
}

export interface RecentSearch {
  id: string;
  query: string;
  locale: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  subscriptionStatus: string;
  hasActiveSubscription: boolean;
}

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function get(path: string): Promise<Response> {
  return fetch(buildUrl(path).toString(), { credentials: "include" });
}

function postJson(path: string, body?: unknown): Promise<Response> {
  return fetch(buildUrl(path).toString(), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
}

export interface SearchResponse {
  results: ProductSummary[];
  page: number;
  pageCount: number;
  total: number;
}

export async function searchProducts(query: string, locale: Locale, page = 1) {
  const url = buildUrl("/api/products/search");
  url.searchParams.set("q", query);
  url.searchParams.set("locale", locale);
  url.searchParams.set("page", String(page));
  const response = await fetch(url.toString(), { credentials: "include" });
  return handle<SearchResponse>(response);
}

export async function getProduct(code: string, locale: Locale) {
  const url = buildUrl(`/api/products/${encodeURIComponent(code)}`);
  url.searchParams.set("locale", locale);
  const response = await fetch(url.toString(), { credentials: "include" });
  return handle<{ product: ProductDetail; hasNutritionAccess: boolean }>(response);
}

export async function getRecentSearches() {
  return handle<{ searches: RecentSearch[] }>(await get("/api/searches/recent"));
}

export async function getSubscriptionStatus() {
  return handle<{ status: string; active: boolean; currentPeriodEnd: string | null }>(
    await get("/api/subscription/status")
  );
}

export async function syncSubscriptionStatus() {
  return handle<{ status: string; active: boolean; currentPeriodEnd: string | null }>(
    await postJson("/api/subscription/sync")
  );
}

export async function createCheckoutSession() {
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;
  return handle<{ url: string }>(await postJson("/api/subscription/checkout", { origin }));
}

export async function login(email: string, password: string) {
  return handle<{ user: User }>(await postJson("/api/auth/login", { email, password }));
}

export async function register(email: string, password: string) {
  return handle<{ user: User }>(await postJson("/api/auth/register", { email, password }));
}

export async function logout() {
  return handle<void>(await postJson("/api/auth/logout"));
}

export async function getCurrentUser() {
  return handle<{ user: User | null }>(await get("/api/auth/me"));
}
