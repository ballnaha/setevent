import { Metadata } from 'next';
export const revalidate = 0; // Force dynamic to ensure updates are immediate
import { prisma } from '@/lib/prisma';
import PromotionsContent from './PromotionsContent';

export const metadata: Metadata = {
    title: 'โปรโมชั่นพิเศษ | SET EVENT Thailand',
    description: 'รวมโปรโมชั่นและดีลพิเศษสุดคุ้มสำหรับบริการเช่าจอ LED เครื่องเสียง เวที และอุปกรณ์งานอีเว้นท์ครบวงจรจาก SET EVENT Thailand',
    keywords: [
        'โปรโมชั่น SET EVENT',
        'ส่วนลดเช่าจอ LED',
        'ดีลพิเศษงานอีเว้นท์',
        'โปรโมชั่นงานแต่งงาน',
        'แพ็คเกจงานอีเว้นท์'
    ],
    openGraph: {
        title: 'โปรโมชั่นพิเศษ | SET EVENT Thailand',
        description: 'รวมโปรโมชั่นและดีลพิเศษสุดคุ้มสำหรับบริการจัดงานอีเว้นท์',
        url: 'https://seteventthailand.com/promotions',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/promotions',
    },
};

// Parsed interface for display
interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    price?: string;
    period?: string;
    features: { label: string; value: string }[];
    category?: string;
    createdAt: string;
}

// Helper to format date
const formatDate = (date: Date): string => {
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Server-side data fetching for better LCP
async function getPromotions(): Promise<Promotion[]> {
    try {
        const promotions = await prisma.promotion.findMany({
            where: { status: 'active' },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                price: true,
                period: true,
                features: true,
                category: true,
                createdAt: true,
            }
        });

        return promotions.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description ?? '',
            image: p.image ?? '',
            price: p.price || undefined,
            period: p.period || undefined,
            features: p.features ? JSON.parse(p.features) : [],
            category: p.category || undefined,
            createdAt: formatDate(p.createdAt)
        }));
    } catch (error) {
        console.error("Failed to fetch promotions:", error);
        return [];
    }
}

export default async function PromotionsPage() {
    const promotions = await getPromotions();

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: promotions.map((promotion, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Offer',
                name: promotion.title,
                description: promotion.description,
                image: promotion.image ? `https://seteventthailand.com${promotion.image}` : undefined,
                price: promotion.price ? promotion.price.replace(/[^0-9]/g, '') : undefined,
                priceCurrency: 'THB',
                url: 'https://seteventthailand.com/promotions'
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <PromotionsContent initialPromotions={promotions} />
        </>
    );
}
