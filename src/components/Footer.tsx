"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-light text-foreground"
        >
          <BookOpen className="size-4 text-muted-foreground" aria-hidden="true" />
          {t("appTitle")}
        </Link>
        <p className="font-mono text-xs text-muted-foreground">
          {t("footerAttribution")}{" "}
          <a
            href="https://world.openfoodfacts.org"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-primary"
          >
            Open Food Facts
          </a>
        </p>
      </div>
    </footer>
  );
}
