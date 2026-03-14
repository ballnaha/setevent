import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PortfolioDetailContent from './PortfolioDetailContent';

import { Metadata } from 'next';

interface PortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: decodedSlug },
    select: { title: true, description: true, image: true, category: true }
  });

  if (!portfolio) {
    return {
      title: 'Not Found | SET EVENT',
      description: 'ผลงานที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ'
    };
  }

  // Use the cover image or a default fallback
  const ogImage = portfolio.image ? portfolio.image : 'https://seteventthailand.com/images/og-image.jpg';
  const rawDesc = portfolio.description || `ผลงาน ${portfolio.title} ในหมวดหมู่ ${portfolio.category} จาก SET EVENT Thailand`;
  // Strip simple HTML tags if description is stored as rich text, max 160 chars
  const plainDesc = rawDesc.replace(/<[^>]*>?/gm, '').substring(0, 160) + (rawDesc.length > 160 ? '...' : '');

  return {
    title: `${portfolio.title} | ผลงาน SET EVENT Thailand`,
    description: plainDesc,
    keywords: [portfolio.title, portfolio.category || '', 'ผลงานอีเวนต์', 'SET EVENT', 'จัดงาน', 'เช่าอุปกรณ์'],
    openGraph: {
      title: `${portfolio.title} | SET EVENT Thailand`,
      description: plainDesc,
      url: `https://seteventthailand.com/portfolio/${slug}`,
      siteName: 'SET EVENT Thailand',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: portfolio.title,
        }
      ],
      locale: 'th_TH',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${portfolio.title} | SET EVENT`,
      description: plainDesc,
      images: [ogImage],
    }
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: decodedSlug },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      image: true,
      createdAt: true,
      images: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          url: true,
          caption: true,
          order: true,
        },
      },
    },
  });

  if (!portfolio) {
    notFound();
  }

  return <PortfolioDetailContent portfolio={portfolio} />;
}
