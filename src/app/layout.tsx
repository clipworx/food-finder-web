import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import "./globals.css";

// Self-hosted (next/font/local) rather than next/font/google: the font files are
// vendored into ./fonts (sourced from the @fontsource-variable/* and @fontsource/*
// npm packages) so the build never depends on reaching fonts.googleapis.com at
// build time. Bitter (display) and Source Serif 4 (body) are true variable fonts,
// so a single file per style covers the full weight range.
const sourceSerif = localFont({
  src: [
    { path: "./fonts/source-serif-4-latin-wght-normal.woff2", weight: "200 900", style: "normal" },
    { path: "./fonts/source-serif-4-latin-wght-italic.woff2", weight: "200 900", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

const bitter = localFont({
  src: [
    { path: "./fonts/bitter-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/bitter-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const courierPrime = localFont({
  src: [
    { path: "./fonts/courier-prime-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/courier-prime-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Food Finder",
  description: "Search packaged food products via Open Food Facts",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${bitter.variable} ${courierPrime.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LocaleProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
