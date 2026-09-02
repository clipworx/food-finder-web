"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { createCheckoutSession } from "@/lib/api";

export function SubscribeCard() {
  const { t } = useLocale();
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
    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="font-medium text-blue-900">{t("subscribeTitle")}</h3>
      <p className="mt-1 text-sm text-blue-800">{t("subscribeBody")}</p>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? t("subscribeLoading") : t("subscribeButton")}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
