"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { KeyRound, LoaderCircle, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function LoginPage() {
  const { t } = useLocale();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError(t("authError"));
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl font-extralight text-foreground">
        {t("loginTitle")}
      </h1>

      <Card className="mt-6 border border-border">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Mail className="size-4" aria-hidden="true" />
                {t("email")}
              </label>
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <KeyRound className="size-4" aria-hidden="true" />
                {t("password")}
              </label>
              <Input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={submitting} className="mt-2">
              {submitting ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogIn className="size-4" aria-hidden="true" />
              )}
              {submitting ? t("loginSubmitting") : t("loginButton")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-4 text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-bold text-primary">
          {t("register")}
        </Link>
      </p>
    </main>
  );
}
