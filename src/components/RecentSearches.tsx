"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { RecentSearch } from "@/lib/api";

export function RecentSearches({
  searches,
  onSelect,
}: {
  searches: RecentSearch[];
  onSelect: (query: string) => void;
}) {
  const { t } = useLocale();

  if (searches.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {t("recentSearches")}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search.id}
            onClick={() => onSelect(search.query)}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
          >
            {search.query}
          </button>
        ))}
      </div>
    </div>
  );
}
