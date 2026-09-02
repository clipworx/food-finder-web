"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function SubscriptionCancelPage() {
  const { t } = useLocale();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="text-xl font-semibold text-gray-900">
        {t("subscriptionCancelTitle")}
      </h1>
      <p className="mt-2 text-sm text-gray-600">{t("subscriptionCancelBody")}</p>
      <Link href="/" className="mt-6 text-sm font-medium text-blue-600">
        {t("backHome")}
      </Link>
    </main>
  );
}
