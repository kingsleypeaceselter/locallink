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
  },
  // Add this section to expose environment variables:
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;