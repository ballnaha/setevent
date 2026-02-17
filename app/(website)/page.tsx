import { Metadata } from 'next';
import HomeContent from './HomeContent';
import BannerSlider from '../components/BannerSlider';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'SET EVENT Thailand | บริการให้เช่าจอ LED เวที แสง เสียง ครบวงจร',
  description: 'SET EVENT Thailand - บริการให้เช่าจอ LED, เวที, แสง, เสียง และอุปกรณ์งานอีเวนต์ครบวงจร สำหรับงานคอนเสิร์ต งานแต่งงาน งานสัมมนา และอีเวนต์ทุกประเภท พร้อมทีมงานมืออาชีพ',
  keywords: [
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
    title: 'SET EVENT Thailand | บริการให้เช่าจอ LED เวที แสง เสียง ครบวงจร',
    description: 'บริการให้เช่าจอ LED, เวที, แสง เสียง และอุปกรณ์งานอีเวนต์ครบวงจร พร้อมทีมงานมืออาชีพ',
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
    title: 'SET EVENT Thailand | เช่าจอ LED เวที แสง เสียง',
    description: 'บริการให้เช่าจอ LED และอุปกรณ์งานอีเวนต์ครบวงจร',
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
