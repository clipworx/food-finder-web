"use client";

import Link from "next/link";
import { useState } from "react";
import { Library, LogOut, Menu, Stamp, X } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Header() {
  const { t } = useLocale();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-extrabold text-foreground"
        >
          <Library className="size-6 text-primary" aria-hidden="true" />
          {t("appTitle")}
        </Link>

        {/* Desktop controls */}
        <div className="hidden items-center gap-3 sm:flex">
          {!loading && user?.hasActiveSubscription && (
            <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-primary">
              <Stamp className="size-4" aria-hidden="true" />
              {t("subscriptionActive")}
            </span>
          )}
          <LanguageSelector />
          {!loading &&
            (user ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  <LogOut className="size-4" aria-hidden="true" />
                  {t("logout")}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/login">{t("login")}</Link>}
              />
            ))}
        </div>

        {/* Mobile toggle */}
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden"
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:hidden">
          {!loading && user?.hasActiveSubscription && (
            <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-primary">
              <Stamp className="size-4" aria-hidden="true" />
              {t("subscriptionActive")}
            </span>
          )}
          <LanguageSelector />
          {!loading &&
            (user ? (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-muted-foreground">{user.email}</span>
                <Button variant="outline" onClick={() => logout()}>
                  <LogOut className="size-4" aria-hidden="true" />
                  {t("logout")}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                render={<Link href="/login">{t("login")}</Link>}
              />
            ))}
        </div>
      )}
    </header>
  );
}
