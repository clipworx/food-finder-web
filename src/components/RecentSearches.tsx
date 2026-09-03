"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      <p className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Clock className="size-4" aria-hidden="true" />
        {t("recentSearches")}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {searches.map((search) => (
          <button key={search.id} onClick={() => onSelect(search.query)} className="p-1">
            <Badge variant="outline" className="h-6 cursor-pointer px-3 hover:bg-muted">
              {search.query}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
