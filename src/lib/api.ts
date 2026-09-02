import { Locale } from "./i18n/translations";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function searchProducts(query: string, locale: Locale) {
  const url = new URL("/api/products/search", API_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("locale", locale);
  const response = await fetch(url.toString());
  return handle<{ results: ProductSummary[] }>(response);
}

export async function getProduct(code: string, locale: Locale) {
  const url = new URL(`/api/products/${encodeURIComponent(code)}`, API_URL);
  url.searchParams.set("locale", locale);
  const response = await fetch(url.toString());
  return handle<{ product: ProductDetail; hasNutritionAccess: boolean }>(response);
}

export async function getRecentSearches() {
  const url = new URL("/api/searches/recent", API_URL);
  const response = await fetch(url.toString());
  return handle<{ searches: RecentSearch[] }>(response);
}

export async function getSubscriptionStatus() {
  const url = new URL("/api/subscription/status", API_URL);
  const response = await fetch(url.toString());
  return handle<{ status: string; active: boolean; currentPeriodEnd: string | null }>(
    response
  );
}

export async function createCheckoutSession() {
  const url = new URL("/api/subscription/checkout", API_URL);
  const response = await fetch(url.toString(), { method: "POST" });
  return handle<{ url: string }>(response);
}
