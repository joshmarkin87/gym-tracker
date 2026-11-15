import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lot data is read from /content at build time, so every page is statically generated.
  poweredByHeader: false,
};

export default nextConfig;
