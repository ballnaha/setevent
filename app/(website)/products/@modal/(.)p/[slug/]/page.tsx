import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';
import ProductDetailView from '../../../../components/ProductDetailView';
import ModalWrapper from '../../../../components/ModalWrapper';

type Props = {
    params: Promise<{ slug: string }>
}

export default async function InterceptedProductPage(props: Props) {
    const params = await props.params;
    const slug = decodeURIComponent(params.slug);

    const productData = await prisma.product.findFirst({
        where: { slug: slug, status: 'active' },
        include: {
            category: {
                select: { name: true }
            }
        }
    });

    if (!productData) {
        return notFound();
    }

    const product = {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price ? Number(productData.price) : null,
        priceUnit: (productData as any).priceUnit || null,
        images: productData.images ? JSON.parse(productData.images) : [],
        features: productData.features ? JSON.parse(productData.features) : []
    };

    return (
        <ModalWrapper>
            <ProductDetailView 
                product={product} 
                categoryName={productData.category?.name || "Product"} 
                isModal={true}
            />
        </ModalWrapper>
    );
}
