import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for faster builds
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'iconsax-react',
    ],
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Skip type checking during build (do it separately)
  typescript: {
    // Set to true if you want faster builds but check types separately
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
