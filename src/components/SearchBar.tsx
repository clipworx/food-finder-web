"use client";

import { FormEvent, useState } from "react";
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
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isSearching || !value.trim()}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {isSearching ? t("searching") : t("searchButton")}
      </button>
    </form>
  );
}
