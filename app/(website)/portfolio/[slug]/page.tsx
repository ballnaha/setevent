import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PortfolioDetailContent from './PortfolioDetailContent';

import { Metadata } from 'next';
import { getSEODescription, SEO_FALLBACKS } from '@/lib/seo';

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

  const desc = getSEODescription(
    portfolio.description,
    SEO_FALLBACKS.portfolio(portfolio.title, portfolio.category || '')
  );

  const ogImage = portfolio.image ? portfolio.image : 'https://seteventthailand.com/images/og-image.jpg';

  return {
    title: `${portfolio.title} | ผลงาน SET EVENT Thailand`,
    description: desc,
    keywords: [portfolio.title, portfolio.category || '', 'ผลงานอีเว้นท์', 'SET EVENT', 'จัดงาน', 'เช่าอุปกรณ์'],
    openGraph: {
      title: `${portfolio.title} | SET EVENT Thailand`,
      description: desc,
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
      description: desc,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "หน้าแรก",
                "item": "https://seteventthailand.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "ผลงานของเรา",
                "item": "https://seteventthailand.com/portfolio"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": portfolio.title,
                "item": `https://seteventthailand.com/portfolio/${slug}`
              }
            ]
          })
        }}
      />
      <PortfolioDetailContent portfolio={portfolio} />
    </>
  );
}
