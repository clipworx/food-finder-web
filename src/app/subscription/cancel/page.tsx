"use client";

import Link from "next/link";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function SubscriptionCancelPage() {
  const { t } = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-2 px-4 py-16">
      <h1 className="flex items-center gap-2 font-display text-3xl font-extralight text-foreground">
        <CircleAlert className="size-8 text-accent" aria-hidden="true" />
        {t("subscriptionCancelTitle")}
      </h1>
      <p className="text-sm text-muted-foreground">{t("subscriptionCancelBody")}</p>
      <Link href="/" className="mt-4 flex w-fit items-center gap-1.5 text-sm font-bold text-primary">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("backHome")}
      </Link>
    </main>
  );
}
