import { Metadata } from 'next';
import { getSEODescription, SEO_FALLBACKS } from '@/lib/seo';
import DesignsContent from './DesignsContent';
import prisma from '@/lib/prisma';

// Revalidate every 60 seconds for fresh data with caching
export const revalidate = 0;

export const metadata: Metadata = {
    title: 'New Designs | SET EVENT',
    description: SEO_FALLBACKS.design(),
    keywords: ['งานแต่งงาน', 'อีเวนต์', 'ออกแบบเวที', 'Stage Design', 'Wedding Planner', 'Event Organizer', 'สัมมนา', 'คอนเสิร์ต', 'งานเปิดตัวสินค้า', 'SET EVENT'],
    alternates: {
        canonical: 'https://seteventthailand.com/designs',
    },
};

export default async function DesignsPage() {
    // Fetch data on the server
    const designs = await prisma.design.findMany({
        where: { status: 'active' },
        orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
        ],
        select: {
            id: true,
            title: true,
            category: true,
            image: true,
            likes: true,
            views: true,
        }
    });

    const initialData = designs.map(d => ({
        ...d,
        image: d.image || '/images/placeholder.jpg'
    }));

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: 'New Designs | SET EVENT',
        description: 'ผลงานการออกแบบและจัดอีเวนต์ที่สวยงาม สร้างสรรค์โดยทีมงาน SET EVENT',
        url: 'https://seteventthailand.com/designs',
        image: initialData.map(d => ({
            '@type': 'ImageObject',
            name: d.title,
            contentUrl: `https://seteventthailand.com${d.image}`,
            itemLocation: {
                '@type': 'Place',
                name: d.category
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <DesignsContent initialData={initialData} />
        </>
    );
}
