"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function SearchBar({
  onSearch,
  isSearching,
}: {
  onSearch: (query: string) => void;
  isSearching: boolean;
}) {
  const { t } = useLocale();
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="pl-9 text-base"
        />
      </div>
      <Button type="submit" size="lg" disabled={isSearching || !value.trim()}>
        {isSearching ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="size-4" aria-hidden="true" />
        )}
        {isSearching ? t("searching") : t("searchButton")}
      </Button>
    </form>
  );
}
