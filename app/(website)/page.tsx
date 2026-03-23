import { Metadata } from 'next';
import HomeContent from './HomeContent';
import BannerSlider from '../components/BannerSlider';

export const revalidate = 0; // Force dynamic rendering

export const metadata: Metadata = {
  title: 'SET EVENT Thailand | บริการเช่าจอ LED ราคาถูก จัดงานราคาประหยัด',
  description: 'SET EVENT Thailand - บริการให้เช่าจอ LED ราคาถูก, เวที, แสง, เสียง และอุปกรณ์จัดงานอีเว้นท์ครบวงจร รับจัดงานอีเว้นท์ จัดงานราคาประหยัด ครบจบในงบเดียว พร้อมทีมงานมืออาชีพ',
  keywords: [
    'เช่าจอ LED ราคาถูก',
    'จัดงานราคาประหยัด',
    'เช่าเครื่องเสียงราคาถูก',
    'เช่าไฟพาร์ราคาถูก',
    'จัดงานอีเว้นท์ราคาถูก',
    'รับจัดงานอีเว้นท์ราคาประหยัด',
    'เช่าจอ LED',
    'จอ LED งานอีเวนต์',
    'เช่าเครื่องเสียง',
    'เช่าไฟเวที',
    'เช่าเวที',
    'จัดงานอีเวนต์',
    'งานคอนเสิร์ต',
    'งานแต่งงาน',
    'งานสัมมนา',
    'SET EVENT',
    'อีเวนต์ประเทศไทย'
  ],
  openGraph: {
    title: 'SET EVENT Thailand | จอ LED ราคาถูก เช่าเครื่องเสียง และจัดงานราคาประหยัด',
    description: 'บริการให้เช่าจอ LED ราคาถูก, เวที, แสง เสียง และอุปกรณ์งานอีเวนต์ครบวงจร จัดงานราคาประหยัด พร้อมทีมงานมืออาชีพ',
    url: 'https://seteventthailand.com',
    siteName: 'SET EVENT Thailand',
    locale: 'th_TH',
    type: 'website',
    images: [
      {
        url: 'https://seteventthailand.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SET EVENT Thailand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SET EVENT Thailand | เช่าจอ LED ราคาถูก เวที แสง เสียง',
    description: 'บริการให้เช่าจอ LED และอุปกรณ์งานอีเวนต์ครบวงจร จัดงานราคาประหยัด',
    images: ['https://seteventthailand.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://seteventthailand.com',
  },
};

export default function Home() {
  return (
    <>
      <BannerSlider />
      <HomeContent />
    </>
  );
}
