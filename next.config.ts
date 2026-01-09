import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

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
    ignoreBuildErrors: true,
  },
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// ในโหมด Development ให้ส่งออก nextConfig โดยตรงเพื่อให้ Turbopack ทำงานได้ (เพราะ Turbopack ไม่รองรับ Webpack Plugin ของ PWA)
// ในโหมดอื่น (Production/Build) ให้ครอบด้วย withPWA เพื่อสร้าง Service Worker
export default process.env.NODE_ENV === "development" ? nextConfig : withPWA(nextConfig);
