import { Metadata } from 'next';
import { PrismaClient } from '@prisma/client';
import PromotionsContent from './PromotionsContent';

// Use a singleton PrismaClient for better performance
const prisma = new PrismaClient();

export const metadata: Metadata = {
    title: 'โปรโมชั่นพิเศษ | SET EVENT Thailand',
    description: 'รวมโปรโมชั่นและดีลพิเศษสุดคุ้มสำหรับบริการเช่าจอ LED เครื่องเสียง เวที และอุปกรณ์งานอีเวนต์ครบวงจรจาก SET EVENT Thailand',
    keywords: [
        'โปรโมชั่น SET EVENT',
        'ส่วนลดเช่าจอ LED',
        'ดีลพิเศษงานอีเวนต์',
        'โปรโมชั่นงานแต่งงาน',
        'แพ็คเกจงานอีเวนต์'
    ],
    openGraph: {
        title: 'โปรโมชั่นพิเศษ | SET EVENT Thailand',
        description: 'รวมโปรโมชั่นและดีลพิเศษสุดคุ้มสำหรับบริการจัดงานอีเวนต์',
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
            createdAt: formatDate(p.createdAt)
        }));
    } catch (error) {
        console.error("Failed to fetch promotions:", error);
        return [];
    }
}

export default async function PromotionsPage() {
    const promotions = await getPromotions();

    return <PromotionsContent initialPromotions={promotions} />;
}
