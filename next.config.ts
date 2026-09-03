import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:4001";

const nextConfig: NextConfig = {
  // Proxy API calls through the Next.js server (same origin as the page) so the
  // browser never makes a cross-origin request to the backend's dev-tunnel URL —
  // that tunnel requires a same-origin cookie for access that a cross-origin
  // fetch() doesn't send, which otherwise fails with a redirect/CORS error.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
