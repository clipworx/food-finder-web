"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LOCALES } from "@/lib/i18n/translations";

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();

  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(e) => setLocale(e.target.value as typeof locale)}
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900"
    >
      {LOCALES.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
