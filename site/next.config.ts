import type { NextConfig } from "next";

const isCloudflarePagesStatic =
  process.env.CLOUDFLARE_PAGES_STATIC === "1";

const nextConfig: NextConfig = isCloudflarePagesStatic
  ? {
      output: "export",
      trailingSlash: true,
      images: {
        unoptimized: true,
      },
    }
  : {};

export default nextConfig;
