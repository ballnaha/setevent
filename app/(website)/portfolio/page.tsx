import { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';
import prisma from '@/lib/prisma';

// Revalidate every 60 seconds for fresh data with caching
export const revalidate = 60;

export const metadata: Metadata = {
    // ... metadata content (keep as is)
    title: 'ผลงาน Portfolio | SET EVENT Thailand',
    description: 'ชมผลงานที่ผ่านมาของ SET EVENT Thailand - งาน Marketing Event, Seminar, นิทรรศการ, คอนเสิร์ต, งานแต่งงาน และ Fixed Installation ด้วยทีมงานมืออาชีพ',
    keywords: [
        'Portfolio SET EVENT',
        'ผลงานจัดอีเวนต์',
        'งาน Marketing Event',
        'คอนเสิร์ต',
        'งานแต่งงาน',
        'สัมมนา',
        'นิทรรศการ',
        'Fixed Installation'
    ],
    openGraph: {
        title: 'ผลงาน Portfolio | SET EVENT Thailand',
        description: 'ชมผลงานจัดงานอีเวนต์ที่ผ่านมาของ SET EVENT Thailand',
        url: 'https://seteventthailand.com/portfolio',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/portfolio',
    },
};

export default async function PortfolioPage() {
    // Fetch data on the server
    const portfolios = await prisma.portfolio.findMany({
        where: { status: 'active' },
        orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
        ],
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            image: true,
        }
    });

    // Convert Decimal/Date if necessary (though findMany here doesn't return them in select)
    const initialData = portfolios.map(p => ({
        ...p,
        image: p.image || '/images/placeholder.jpg'
    }));

    return <PortfolioContent initialData={initialData} />;
}
