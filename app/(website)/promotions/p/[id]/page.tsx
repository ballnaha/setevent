import { Metadata } from 'next';
import { getSEODescription, SEO_FALLBACKS } from '@/lib/seo';
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';
import PromotionDetailView from '../../components/PromotionDetailView';
import { Box } from "@mui/material";

type Props = {
    params: Promise<{ id: string }>
}

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const id = params.id;
    const baseUrl = 'https://seteventthailand.com';

    const decodedTitle = decodeURIComponent(id);
    const promo = await prisma.promotion.findFirst({
        where: { title: decodedTitle, status: 'active' }
    });

    if (!promo) {
        return { title: 'Promotion Not Found | SET EVENT' };
    }

    const desc = getSEODescription(
        promo.description,
        SEO_FALLBACKS.promotion(promo.title, promo.description)
    );

    return {
        title: `${promo.title} - โปรโมชั่นพิเศษ SET EVENT`,
        description: desc,
        alternates: {
            canonical: `${baseUrl}/promotions/p/${encodeURIComponent(promo.title)}`,
        },
        openGraph: {
            title: `${promo.title} | SET EVENT`,
            description: desc,
            url: `${baseUrl}/promotions/p/${encodeURIComponent(promo.title)}`,
            images: promo.image ? [{ url: promo.image.startsWith('http') ? promo.image : `${baseUrl}${promo.image}` }] : [],
        }
    };
}

export default async function PromotionPage(props: Props) {
    const params = await props.params;
    const id = params.id;

    const decodedTitle = decodeURIComponent(id);
    const promoData = await prisma.promotion.findFirst({
        where: { title: decodedTitle, status: 'active' }
    });

    if (!promoData) {
        return notFound();
    }

    const promotion = {
        id: promoData.id,
        title: promoData.title,
        description: promoData.description || '',
        image: promoData.image || '',
        price: promoData.price || undefined,
        period: promoData.period || undefined,
        features: promoData.features ? JSON.parse(promoData.features) : [],
        category: promoData.category || undefined,
        createdAt: formatDate(promoData.createdAt)
    };

    return (
        <Box sx={{
            bgcolor: '#1a1a1a',
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            overflowY: 'auto'
        }}>
            <PromotionDetailView
                promotion={promotion}
                isModal={false}
            />
        </Box>
    );
}
