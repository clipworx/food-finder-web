"use client";

import { useCallback, useEffect, useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ProductCard } from "@/components/ProductCard";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchBar } from "@/components/SearchBar";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import {
  ProductSummary,
  RecentSearch,
  getRecentSearches,
  searchProducts,
} from "@/lib/api";

export default function HomePage() {
  const { locale, t } = useLocale();
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const refreshRecentSearches = useCallback(() => {
    getRecentSearches()
      .then(({ searches }) => setRecentSearches(searches))
      .catch(() => setRecentSearches([]));
  }, []);

  useEffect(() => {
    refreshRecentSearches();
  }, [refreshRecentSearches]);

  async function handleSearch(query: string) {
    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    try {
      const { results } = await searchProducts(query, locale);
      setResults(results);
      refreshRecentSearches();
    } catch {
      setError(t("searchError"));
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{t("appTitle")}</h1>
        <LanguageSelector />
      </header>

      <section>
        <SearchBar onSearch={handleSearch} isSearching={isSearching} />
        <RecentSearches searches={recentSearches} onSelect={handleSearch} />
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!error && hasSearched && !isSearching && results.length === 0 && (
        <p className="text-sm text-gray-500">{t("noResults")}</p>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </section>
    </main>
  );
}
