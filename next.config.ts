import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // Optimize for faster initial load
  register: true,
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    // Don't precache everything - use runtime caching instead
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB limit
    // Exclude large chunks from precache
    exclude: [
      /\.map$/,
      /^manifest.*\.js$/,
      /\.woff2$/,
      /\.woff$/,
    ],
    runtimeCaching: [
      {
        // Cache pages with Network First strategy
        urlPattern: /^https?:\/\/.*\/(?!api\/).*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        // Cache static assets with Cache First
        urlPattern: /\/_next\/static\/.*/,
        handler: "CacheFirst",
        options: {
          cacheName: "static-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        // Cache images
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
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
      'date-fns',
    ],
  },

  // Image configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
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
