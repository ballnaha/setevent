import type { Metadata, Viewport } from "next";
import { Prompt, Comfortaa } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Providers } from "./providers";
import { ThemeProvider as NextThemeProvider } from "./theme-provider";


const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SetEvent - บริการให้เช่าอุปกรณ์จัดงาน เช่าจอ LED ราคาถูก รับจัดงานราคาประหยัด",
    template: "%s | SetEvent",
  },
  description: "SetEvent ผู้นำด้านบริการให้เช่าอุปกรณ์จัดงานอีเว้นท์ เช่าจอ LED ราคาถูก รับจัดงานอีเว้นท์ จัดงานราคาประหยัด งานแต่ง งานเปิดตัวสินค้า จบในงบที่คุณต้องการ",
  keywords: [
    "เช่าจอ led ราคาถูก",
    "จัดงานราคาประหยัด",
    "เช่าเครื่องเสียงราคาถูก",
    "เช่าไฟพาร์ราคาถูก",
    "จัดงานอีเว้นท์ราคาถูก",
    "รับจัดงานอีเว้นท์ราคาประหยัด",
    "ให้เช่าอุปกรณ์อีเว้นท์",
    "รับจัดงานอีเว้นท์",
    "รับจัดงานแต่งงาน",
    "เช่าเวที",
    "เช่าเครื่องเสียง",
    "SetEvent",
    "เซ็ทอีเว้นท์",
    "อุปกรณ์จัดงาน",
    "รับจัดอีเว้นท์ครบวงจร",
    "งานสัมมนา",
    "งานเปิดตัวสินค้า",
    "งานปาร์ตี้"
  ],
  authors: [{ name: "SetEvent Team" }],
  creator: "SetEvent Team",
  publisher: "SetEvent Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://seteventthailand.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SetEvent - เช่าจอ LED ราคาถูก รับจัดงานอีเว้นท์ราคาประหยัด",
    description: "บริการให้เช่าอุปกรณ์จัดงานอีเว้นท์ เช่าจอ LED ราคาถูก และรับจัดงานทุกรูปแบบ งานแต่ง งานเลี้ยง จัดงานราคาประหยัด มืออาชีพ",
    url: "https://seteventthailand.com",
    siteName: "SetEvent",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SetEvent บริการเช่าอุปกรณ์และรับจัดงานอีเว้นท์ ราคาถูก",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SetEvent - บริการเช่าจอ LED ราคาถูก และรับจัดงานอีเว้นท์",
    description: "ผู้นำด้านอีเว้นท์ ให้เช่าอุปกรณ์และรับจัดงานครบวงจร จัดงานราคาประหยัด",
    images: ["/images/icon-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/images/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    // Add other verifications as needed
    // bing: 'your-bing-verification-code',
  },
  category: 'event services',
  classification: 'Business',
  other: {
    google: "notranslate",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SET EVENT",
    "mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: false,
  viewportFit: "cover",
};

import GoogleAnalytics from './components/GoogleAnalytics';
import CookieConsentWrapper from './components/CookieConsentWrapper';
import NextTopLoader from 'nextjs-toploader';
import PageScrollTop from './components/PageScrollTop';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" translate="no" suppressHydrationWarning>
      <head>
        {/* Preconnect hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* WebSite Schema for Sitelinks Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://seteventthailand.com/#website",
              "name": "SET EVENT Thailand",
              "url": "https://seteventthailand.com",
              "description": "บริการให้เช่าจอ LED ราคาถูก เวที แสง เสียง และอุปกรณ์จัดงานอีเว้นท์ครบวงจร จัดงานราคาประหยัด",
              "inLanguage": "th-TH",
              "publisher": {
                "@id": "https://seteventthailand.com/#organization"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://seteventthailand.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://seteventthailand.com/#organization",
              "name": "SET EVENT Thailand",
              "alternateName": ["SetEvent", "เซ็ทอีเว้นท์", "SET EVENT"],
              "url": "https://seteventthailand.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://seteventthailand.com/images/logo.png",
                "width": 512,
                "height": 512
              },
              "image": "https://seteventthailand.com/images/og-image.jpg",
              "description": "SET EVENT Thailand - บริการให้เช่าจอ LED ราคาถูก, เวที, แสง เสียง และอุปกรณ์งานอีเว้นท์ครบวงจร พร้อมทีมงานมืออาชีพ จัดงานราคาประหยัด",
              "telephone": "+66-93-726-5055",
              "email": "setevent26@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Bangkok",
                "addressLocality": "Bangkok",
                "addressRegion": "Bangkok",
                "postalCode": "10000",
                "addressCountry": "TH"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 13.7563,
                "longitude": 100.5236
              },
              "areaServed": {
                "@type": "Country",
                "name": "Thailand"
              },
              "foundingDate": "2015",
              "slogan": "End-to-End Event Solution",
              "sameAs": [
                "https://www.facebook.com/seteventthailand",
                "https://www.instagram.com/setevent",
                "https://line.me/ti/p/~@setevent",
                "https://www.youtube.com/@setevent"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+66-93-726-5055",
                "contactType": "customer service",
                "availableLanguage": ["Thai", "English"],
                "areaServed": "TH"
              }
            })
          }}
        />
      </head>
      <body
        className={`${prompt.variable} ${comfortaa.variable} antialiased`}
        style={{ margin: 0 }}
        suppressHydrationWarning
      >
        <NextTopLoader
          color="#0A5C5A"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #0A5C5A,0 0 5px #0A5C5A"
        />
        <PageScrollTop />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />

        <Providers>
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
                <CookieConsentWrapper />
              </ThemeProvider>
            </AppRouterCacheProvider>
          </NextThemeProvider>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://seteventthailand.com/#localbusiness",
              "name": "SET EVENT Thailand",
              "image": [
                "https://seteventthailand.com/images/logo.png",
                "https://seteventthailand.com/images/og-image.jpg"
              ],
              "description": "บริการให้เช่าจอ LED ราคาถูก เวที แสง เสียง และอุปกรณ์จัดงานอีเว้นท์ครบวงจร รับจัดงานแต่งงาน งานสัมมนา จัดงานราคาประหยัด ด้วยทีมงานมืออาชีพ",
              "url": "https://seteventthailand.com",
              "telephone": "+66-93-726-5055",
              "email": "setevent26@gmail.com",
              "priceRange": "฿฿฿",
              "currenciesAccepted": "THB",
              "paymentAccepted": "Cash, Credit Card, Bank Transfer",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Bangkok",
                "addressLocality": "Bangkok",
                "addressRegion": "Bangkok",
                "postalCode": "10000",
                "addressCountry": "TH"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 13.7563,
                "longitude": 100.5236
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday", "Sunday"],
                  "opens": "09:00",
                  "closes": "18:00"
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "บริการเช่าอุปกรณ์งานอีเว้นท์",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "เช่าจอ LED ราคาถูก",
                      "description": "บริการให้เช่าจอ LED ราคาถูก ทุกขนาด Indoor และ Outdoor พร้อมติดตั้ง"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "เช่าเวที",
                      "description": "บริการให้เช่าเวทีและโครงสร้าง Truss ราคาประหยัด"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "เช่าระบบแสงเสียง",
                      "description": "บริการให้เช่าระบบแสง เสียง เครื่องเสียง ครบวงจร ราคาถูก"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "รับจัดงานอีเว้นท์",
                      "description": "รับจัดงานอีเว้นท์ครบวงจร งานแต่งงาน งานสัมมนา จัดงานราคาประหยัด"
                    }
                  }
                ]
              },
              "sameAs": [
                "https://www.facebook.com/seteventthailand",
                "https://www.instagram.com/setevent",
                "https://line.me/ti/p/~@setevent",
                "https://www.youtube.com/@setevent"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
