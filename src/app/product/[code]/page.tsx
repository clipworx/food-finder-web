"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { SubscribeCard } from "@/components/SubscribeCard";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { ProductDetail, getProduct } from "@/lib/api";

const NUTRIMENT_KEYS: { key: string; labelKey: string }[] = [
  { key: "energyKcal100g", labelKey: "energy" },
  { key: "fat100g", labelKey: "fat" },
  { key: "saturatedFat100g", labelKey: "saturatedFat" },
  { key: "carbohydrates100g", labelKey: "carbohydrates" },
  { key: "sugars100g", labelKey: "sugars" },
  { key: "fiber100g", labelKey: "fiber" },
  { key: "proteins100g", labelKey: "proteins" },
  { key: "salt100g", labelKey: "salt" },
];

export default function ProductPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const { locale, t } = useLocale();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [hasNutritionAccess, setHasNutritionAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProduct(code, locale)
      .then(({ product, hasNutritionAccess }) => {
        if (cancelled) return;
        setProduct(product);
        setHasNutritionAccess(hasNutritionAccess);
      })
      .catch(() => {
        if (!cancelled) setError(t("productNotFound"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code, locale, t]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Link href="/" className="text-sm font-medium text-blue-600">
        ← {t("backToResults")}
      </Link>

      {loading && <p className="mt-6 text-sm text-gray-500">{t("searching")}</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {product && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name ?? product.code}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {product.name ?? product.code}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {product.brand ?? t("brandUnknown")}
              </p>
              {product.quantity && (
                <p className="mt-1 text-xs text-gray-400">
                  {t("quantity")}: {product.quantity}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t("ingredientsTitle")}
            </h2>
            <p className="mt-1 text-sm text-gray-700">
              {product.ingredientsText ?? t("ingredientsUnknown")}
            </p>
          </div>

          {hasNutritionAccess ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {t("nutritionTitle")}
              </h2>
              <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                {NUTRIMENT_KEYS.map(({ key, labelKey }) => {
                  const value = product.nutriments?.[key];
                  return (
                    <div key={key}>
                      <dt className="text-xs text-gray-500">{t(labelKey)}</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {value ?? "—"}
                      </dd>
                    </div>
                  );
                })}
                {product.nutriScore && (
                  <div>
                    <dt className="text-xs text-gray-500">{t("nutriScore")}</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {product.nutriScore}
                    </dd>
                  </div>
                )}
                {product.novaGroup && (
                  <div>
                    <dt className="text-xs text-gray-500">{t("novaGroup")}</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {product.novaGroup}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <SubscribeCard />
          )}
        </div>
      )}
    </main>
  );
}
