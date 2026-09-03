"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CircleCheckBig, LoaderCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { syncSubscriptionStatus } from "@/lib/api";

export default function SubscriptionSuccessPage() {
  const { t } = useLocale();
  const { refresh } = useAuth();
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    syncSubscriptionStatus()
      .then(() => refresh())
      .catch(() => {})
      .finally(() => setSyncing(false));
  }, [refresh]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-2 px-4 py-16">
      <h1 className="flex items-center gap-2 font-display text-3xl font-extralight text-primary">
        <CircleCheckBig className="size-8" aria-hidden="true" />
        {t("subscriptionSuccessTitle")}
      </h1>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        {syncing && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        {syncing ? t("subscriptionSyncing") : t("subscriptionSuccessBody")}
      </p>
      <Link href="/" className="mt-4 flex w-fit items-center gap-1.5 text-sm font-bold text-primary">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("backHome")}
      </Link>
    </main>
  );
}
