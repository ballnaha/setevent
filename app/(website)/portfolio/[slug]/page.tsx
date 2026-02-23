import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PortfolioDetailContent from './PortfolioDetailContent';

interface PortfolioPageProps {
  params: Promise<{ slug: string }>;
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
