import type { Metadata, Viewport } from "next";
import { Prompt, Comfortaa } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Providers } from "./providers";

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
    default: "SetEvent - บริการให้เช่าอุปกรณ์จัดงาน และรับจัดงานอีเว้นท์ครบวงจร",
    template: "%s | SetEvent",
  },
  description: "SetEvent ผู้นำด้านบริการให้เช่าอุปกรณ์จัดงานอีเว้นท์ รับจัดงานอีเว้นท์ งานแต่งงาน งานเปิดตัวสินค้า และงานเลี้ยงสังสรรค์ ด้วยอุปกรณ์คุณภาพสูงและทีมงานมืออาชีพ ครบจบในที่เดียว",
  keywords: ["ให้เช่าอุปกรณ์อีเว้นท์", "รับจัดงานอีเว้นท์", "รับจัดงานแต่งงาน", "เช่าเวที", "เช่าเครื่องเสียง", "SetEvent", "เซ็ทอีเว้นท์", "อุปกรณ์จัดงาน", "รับจัดอีเว้นท์ครบวงจร", "งานสัมมนา", "งานเปิดตัวสินค้า", "งานปาร์ตี้"],
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
    title: "SetEvent - บริการให้เช่าอุปกรณ์จัดงาน และรับจัดงานอีเว้นท์ครบวงจร",
    description: "บริการให้เช่าอุปกรณ์จัดงานอีเว้นท์ และรับจัดงานทุกรูปแบบ งานแต่ง งานเลี้ยง งานเปิดตัวสินค้า มืออาชีพ ราคามิตรภาพ",
    url: "https://seteventthailand.com",
    siteName: "SetEvent",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "SetEvent บริการเช่าอุปกรณ์และรับจัดงานอีเว้นท์",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SetEvent - บริการให้เช่าอุปกรณ์จัดงาน และรับจัดงานอีเว้นท์ครบวงจร",
    description: "ผู้นำด้านอีเว้นท์ ให้เช่าอุปกรณ์และรับจัดงานครบวงจร",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" translate="no">
      <body
        className={`${prompt.variable} ${comfortaa.variable} antialiased`}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}
      >
        <Providers>
          <AppRouterCacheProvider>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  );
}
