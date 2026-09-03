"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Pagination({
  page,
  pageCount,
  onPageChange,
  disabled,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  const { t } = useLocale();

  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        {t("previousPage")}
      </Button>
      <p className="font-mono text-xs text-muted-foreground">
        {t("pageOf").replace("{page}", String(page)).replace("{pageCount}", String(pageCount))}
      </p>
      <Button
        variant="outline"
        disabled={disabled || page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        {t("nextPage")}
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
