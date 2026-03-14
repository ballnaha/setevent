import { Metadata } from 'next';
import ProductsContent from './ProductsContent';
import prisma from '@/lib/prisma';

// Revalidate every 60 seconds for fresh data with caching
export const revalidate = 0;

export const metadata: Metadata = {
    title: 'สินค้าและบริการ | SET EVENT Thailand',
    description: 'บริการเช่าจอ LED, เครื่องเสียง, ไฟเวที, โครงสร้างเวที, Motion Graphic, Interactive, Laser Show และอุปกรณ์งานอีเวนต์ครบวงจรจาก SET EVENT Thailand',
    keywords: [
        'เช่าจอ LED',
        'เช่าเครื่องเสียง',
        'เช่าไฟเวที',
        'เช่าเวที',
        'โครงสร้าง Truss',
        'Motion Graphic',
        'Laser Show',
        'Interactive',
        'จอ LED Indoor',
        'จอ LED Outdoor',
        'SET EVENT'
    ],
    openGraph: {
        title: 'สินค้าและบริการ | SET EVENT Thailand',
        description: 'บริการเช่าจอ LED เครื่องเสียง ไฟเวที และอุปกรณ์งานอีเวนต์ครบวงจร',
        url: 'https://seteventthailand.com/products',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/products',
    },
};

export default async function ProductsPage() {
    const data = await prisma.category.findMany({
        where: { status: 'active' },
        include: {
            _count: {
                select: { products: true, children: true }
            }
        },
        orderBy: { order: 'asc' }
    });

    // Filter to get only root categories and build tree
    const rootCats = data.filter((cat: any) => !cat.parentId);
    const initialData = rootCats.map((root: any) => ({
        ...root,
        children: data.filter((cat: any) => cat.parentId === root.id).map((child: any) => ({
            ...child,
            _count: {
                products: child._count.products,
                children: child._count.children
            }
        }))
    }));

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: rootCats.map((cat: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'CollectionPage',
                name: cat.name,
                description: cat.description || `หมวดหมู่สิ้นค้า ${cat.name}`,
                image: cat.image ? `https://seteventthailand.com${cat.image}` : undefined,
                url: `https://seteventthailand.com/products/${cat.slug}`
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <ProductsContent initialData={initialData} />
        </>
    );
}
