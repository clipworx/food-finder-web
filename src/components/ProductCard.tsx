"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { ProductSummary } from "@/lib/api";

export function ProductCard({ product }: { product: ProductSummary }) {
  const { t } = useLocale();

  return (
    <Link href={`/product/${encodeURIComponent(product.code)}`} className="group block">
      <Card className="gap-0 overflow-hidden border border-border py-0 transition-colors group-hover:border-primary">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name ?? product.code}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
              <ImageOff className="size-8" aria-hidden="true" />
              No image
            </div>
          )}
        </div>
        <CardContent className="flex flex-col gap-3 pt-4 pb-4">
          <div>
            <h3 className="line-clamp-2 font-display text-lg font-light text-foreground">
              {product.name ?? product.code}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.brand ?? t("brandUnknown")}
            </p>
            {product.quantity && (
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {product.quantity}
              </p>
            )}
          </div>
          <span className="flex items-center gap-1 font-mono text-sm font-bold text-primary">
            {t("viewDetails")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
