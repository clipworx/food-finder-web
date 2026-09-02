"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { ProductSummary } from "@/lib/api";

export function ProductCard({ product }: { product: ProductSummary }) {
  const { t } = useLocale();

  return (
    <Link
      href={`/product/${encodeURIComponent(product.code)}`}
      className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="relative mb-3 flex h-32 items-center justify-center overflow-hidden rounded-md bg-gray-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name ?? product.code}
            fill
            className="object-contain p-2"
            unoptimized
          />
        ) : (
          <span className="text-xs text-gray-400">No image</span>
        )}
      </div>
      <h3 className="line-clamp-2 font-medium text-gray-900">
        {product.name ?? product.code}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{product.brand ?? t("brandUnknown")}</p>
      {product.quantity && (
        <p className="mt-1 text-xs text-gray-400">{product.quantity}</p>
      )}
      <span className="mt-3 text-sm font-medium text-blue-600">{t("viewDetails")}</span>
    </Link>
  );
}
