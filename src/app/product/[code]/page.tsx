"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleAlert,
  FlaskConical,
  ImageOff,
  LoaderCircle,
  ScrollText,
  Stamp,
} from "lucide-react";
import { SubscribeCard } from "@/components/SubscribeCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6">
      <Link href="/" className="flex w-fit items-center gap-1.5 text-sm font-bold text-primary">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("backToResults")}
      </Link>

      {loading && (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          {t("searching")}
        </p>
      )}
      {error && (
        <p className="mt-6 flex items-center gap-2 text-sm text-destructive">
          <CircleAlert className="size-4" aria-hidden="true" />
          {error}
        </p>
      )}

      {product && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name ?? product.code}
                  fill
                  className="object-contain p-8"
                  unoptimized
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
                  <ImageOff className="size-8" aria-hidden="true" />
                  No image
                </div>
              )}
            </div>

            <h1 className="mt-6 font-display text-3xl font-extralight text-foreground">
              {product.name ?? product.code}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.brand ?? t("brandUnknown")}
            </p>
            {product.quantity && (
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {t("quantity")}: {product.quantity}
              </p>
            )}

            {(product.nutriScore || product.novaGroup) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.nutriScore && (
                  <Badge className="gap-1 bg-accent text-accent-foreground">
                    <Stamp className="size-3" aria-hidden="true" />
                    {t("nutriScore")} {product.nutriScore}
                  </Badge>
                )}
                {product.novaGroup && (
                  <Badge variant="outline">
                    {t("novaGroup")} {product.novaGroup}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <Card className="border border-border">
              <CardContent>
                <h2 className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  <ScrollText className="size-4" aria-hidden="true" />
                  {t("ingredientsTitle")}
                </h2>
                <p className="mt-2 text-sm text-foreground">
                  {product.ingredientsText ?? t("ingredientsUnknown")}
                </p>
              </CardContent>
            </Card>

            {hasNutritionAccess ? (
              <Card className="border border-border">
                <CardContent>
                  <h2 className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <FlaskConical className="size-4" aria-hidden="true" />
                    {t("nutritionTitle")}
                  </h2>
                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                    {NUTRIMENT_KEYS.map(({ key, labelKey }) => {
                      const value = product.nutriments?.[key];
                      return (
                        <div key={key} className="border-b border-border pb-2">
                          <dt className="text-xs text-muted-foreground">{t(labelKey)}</dt>
                          <dd className="font-mono text-sm font-bold text-foreground">
                            {value ?? "—"}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </CardContent>
              </Card>
            ) : (
              <SubscribeCard />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
