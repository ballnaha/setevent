import { Metadata } from 'next';
import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';
import ProductDetailView from '../../components/ProductDetailView';
import { Box } from "@mui/material";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const slug = params.slug;

    const product = await prisma.product.findFirst({
        where: { slug: slug, status: 'active' },
        include: { category: true }
    });

    if (!product) {
        return { title: 'Product Not Found | SET EVENT' };
    }

    const images = product.images ? JSON.parse(product.images) : [];

    return {
        title: `${product.name} - SET EVENT`,
        description: product.description || `บริการเช่า ${product.name} สำหรับงานอีเวนต์ครบวงจร`,
        openGraph: {
            title: `${product.name} | SET EVENT`,
            description: product.description || undefined,
            images: images.length > 0 ? [{ url: images[0] }] : [],
        }
    };
}

export default async function ProductPage(props: Props) {
    const params = await props.params;
    const slug = params.slug;

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

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images.length > 0 ? `https://seteventthailand.com${product.images[0]}` : undefined,
        offers: product.price ? {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'THB',
            availability: 'https://schema.org/InStock'
        } : undefined
    };

    return (
        <Box sx={{ 
            bgcolor: 'var(--background)',
            position: 'fixed',
            inset: 0,
            zIndex: 9999, // Cover navbar/header
            overflowY: 'auto',
            width: '100%',
            height: '100vh',
        }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <ProductDetailView 
                product={product} 
                categoryName={productData.category?.name || "Product"} 
                isModal={false}
            />
        </Box>
    );
}
