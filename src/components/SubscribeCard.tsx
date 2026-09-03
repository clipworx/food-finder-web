"use client";

import Link from "next/link";
import { useState } from "react";
import { CreditCard, LoaderCircle, LogIn, Stamp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { createCheckoutSession } from "@/lib/api";

export function SubscribeCard() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const { url } = await createCheckoutSession();
      window.location.href = url;
    } catch {
      setError(t("searchError"));
      setLoading(false);
    }
  }

  return (
    <Card className="border-2 border-accent">
      <CardContent className="flex flex-col gap-2">
        <h3 className="flex items-center gap-2 font-display text-2xl font-extralight text-foreground">
          <Stamp className="size-6 text-accent" aria-hidden="true" />
          {t("subscribeTitle")}
        </h3>
        <p className="text-sm text-muted-foreground">{t("subscribeBody")}</p>
        {user ? (
          <Button onClick={handleSubscribe} disabled={loading} className="mt-2 w-fit">
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <CreditCard className="size-4" aria-hidden="true" />
            )}
            {loading ? t("subscribeLoading") : t("subscribeButton")}
          </Button>
        ) : (
          <Button
            className="mt-2 w-fit"
            render={
              <Link href="/login">
                <LogIn className="size-4" aria-hidden="true" />
                {t("subscribeLoginPrompt")}
              </Link>
            }
          />
        )}
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
