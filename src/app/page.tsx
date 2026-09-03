"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, PackageSearch } from "lucide-react";
import { Pagination } from "@/components/Pagination";
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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
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

  async function runSearch(searchQuery: string, requestedPage: number) {
    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    try {
      const { results, page, pageCount, total } = await searchProducts(
        searchQuery,
        locale,
        requestedPage
      );
      setResults(results);
      setPage(page);
      setPageCount(pageCount);
      setTotal(total);
      if (requestedPage === 1) refreshRecentSearches();
    } catch {
      setError(t("searchError"));
      setResults([]);
      setPageCount(1);
      setTotal(0);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSearch(searchQuery: string) {
    setQuery(searchQuery);
    runSearch(searchQuery, 1);
  }

  function handlePageChange(nextPage: number) {
    runSearch(query, nextPage);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 py-16 sm:px-6">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr] lg:items-end">
        <h1 className="font-display text-hero font-extralight leading-[0.95] text-foreground">
          {t("appTitle")}
        </h1>
        <div className="rounded-lg border border-border bg-card p-6">
          <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          <RecentSearches searches={recentSearches} onSelect={handleSearch} />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        {error && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <CircleAlert className="size-4" aria-hidden="true" />
            {error}
          </p>
        )}

        {!error && hasSearched && !isSearching && results.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <PackageSearch className="size-4" aria-hidden="true" />
            {t("noResults")}
          </p>
        )}

        {total > 0 && (
          <p className="font-mono text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("resultsCount").replace("{count}", String(total))}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>

        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          disabled={isSearching}
        />
      </section>
    </main>
  );
}
