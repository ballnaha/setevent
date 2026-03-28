import { Metadata } from 'next';
import HomeContent from './HomeContent';
import BannerSlider from '../components/BannerSlider';

export const revalidate = 0; // Force dynamic rendering

export const metadata: Metadata = {
  title: {
    absolute: 'SET EVENT Thailand | บริการเช่าจอ LED และรับจัดงานอีเว้นท์ราคาถูก',
  },
  description: 'SET EVENT Thailand - บริการให้เช่าจอ LED ใกล้ฉัน ราคาถูก สำหรับงานแต่งงาน งานสัมมนา และอีเว้นท์ทุกรูปแบบ ครบวงจรด้วยระบบแสงสีเสียงมาตรฐาน พร้อมทีมงานติดตั้งมืออาชีพ จัดงานในงบประหยัดที่คุณกำหนดได้',
  keywords: [
    'เช่าจอ LED ใกล้ฉัน',
    'เช่าจอ LED ราคาถูก',
    'เช่าจอ LED งานแต่ง',
    'เช่าจอ LED งานสัมมนา',
    'เช่าจอ LED กรุงเทพ',
    'เช่าจอ LED นนทบุรี',
    'เช่าจอ LED ปทุมธานี',
    'เช่าจอ LED ชลบุรี',
    'เช่าจอ LED นครปฐม',
    'เช่าจอ LED สมุทรสาคร',
    'จัดงานราคาประหยัด',
    'เช่าเครื่องเสียงราคาถูก',
    'เช่าไฟพาร์ราคาถูก',
    'จัดงานอีเว้นท์ราคาถูก',
    'รับจัดงานอีเว้นท์ราคาประหยัด',
    'จอ LED P3 ราคาถูก',
    'บริการติดตั้งจอ LED',
    'เช่าไฟเวที',
    'เช่าเวที',
    'งานแต่งงาน',
    'งานสัมมนา',
    'SET EVENT',
    'อีเว้นท์ประเทศไทย',
    'เช่าจอ led ราคา',
    'เช่าจอ led เริ่มต้น',
    'ขายจอ led'
  ],
  openGraph: {
    title: 'SET EVENT Thailand | จอ LED ราคาถูก เช่าเครื่องเสียง และจัดงานราคาประหยัด',
    description: 'บริการให้เช่าจอ LED ราคาถูก, เวที, แสง เสียง และอุปกรณ์งานอีเว้นท์ครบวงจร จัดงานราคาประหยัด พร้อมทีมงานมืออาชีพ',
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
    description: 'บริการให้เช่าจอ LED และอุปกรณ์งานอีเว้นท์ครบวงจร จัดงานราคาประหยัด',
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

import prisma from '@/lib/prisma';

async function getFaqs() {
  try {
    return await prisma.faq.findMany({
      where: { status: 'active' },
      orderBy: { order: 'asc' },
      take: 6, // Show only first 6 on homepage
      select: {
        id: true,
        question: true,
        answer: true
      }
    });
  } catch (error) {
    console.error("Error fetching FAQs for home:", error);
    return [];
  }
}

export default async function Home() {
  const faqs = await getFaqs();

  return (
    <>
      <BannerSlider />
      <HomeContent faqs={faqs} />
    </>
  );
}
