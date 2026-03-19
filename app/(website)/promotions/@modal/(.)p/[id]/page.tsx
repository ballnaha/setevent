import { prisma } from "@/lib/prisma";
export const revalidate = 0;
import { notFound } from 'next/navigation';
import PromotionDetailView from '../../../components/PromotionDetailView';
import ModalWrapper from '../../../../products/components/ModalWrapper'; // Re-use the modal wrapper from products

type Props = {
    params: Promise<{ id: string }>
}

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function InterceptedPromotionPage(props: Props) {
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
        <ModalWrapper>
            <PromotionDetailView 
                promotion={promotion} 
                isModal={true}
            />
        </ModalWrapper>
    );
}
