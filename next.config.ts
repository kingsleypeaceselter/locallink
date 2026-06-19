import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // This allows production builds to successfully complete even if
    // your project has minor local type-checking or configuration warnings.
    ignoreBuildErrors: true,
  },
  eslint: {
    // This ignores linting checks during the build step as well
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;