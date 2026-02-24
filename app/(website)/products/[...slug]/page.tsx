import { Metadata } from 'next';
import ProductCategoryContent from './ProductCategoryContent';
import { prisma } from "@/lib/prisma";
import { notFound } from 'next/navigation';

// Revalidate every 60 seconds for fresh data with caching
export const revalidate = 60;

type Props = {
    params: Promise<{ slug: string[] }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const slugs = params.slug;
    let currentCategory: { id: string; name: string; description: string | null } | null = null;
    let parentId: string | null = null;

    if (!slugs || !Array.isArray(slugs)) {
        return {
            title: 'Products | SET EVENT',
            description: 'สินค้าและบริการครบวงจร สำหรับงาน Event ทุกรูปแบบ'
        };
    }

    // Traverse the category tree to find the current category
    for (let i = 0; i < slugs.length; i++) {
        const slug = decodeURIComponent(slugs[i]).toLowerCase();
        const categoryData: { id: string; name: string; description: string | null } | null = await prisma.category.findFirst({
            where: {
                slug: slug,
                parentId: parentId
            },
            select: {
                id: true,
                name: true,
                description: true
            }
        });

        if (!categoryData) {
            currentCategory = null;
            break;
        }

        currentCategory = categoryData;
        parentId = categoryData.id;
    }

    if (currentCategory) {
        return {
            title: `${currentCategory.name} - SET EVENT`,
            description: currentCategory.description || `สินค้าและบริการในหมวด ${currentCategory.name} จาก SET EVENT ผู้ให้บริการจัดงานอีเวนต์ครบวงจร`,
            keywords: [currentCategory.name, 'เช่าอุปกรณ์', 'อีเวนต์', 'SET EVENT', ...(slugs || [])]
        };
    }

    return {
        title: 'Products | SET EVENT',
        description: 'สินค้าและบริการครบวงจร สำหรับงาน Event ทุกรูปแบบ'
    };
}

export default async function ProductCategoryPage(props: { params: Promise<{ slug: string[] }> }) {
    const params = await props.params;
    const slugs = params.slug;
    const slugPath = slugs.join('/');

    // Find category by traversing the slug path
    let currentCategory: any = null;
    let parentId: string | null = null;

    for (const rawSlug of slugs) {
        const slug = decodeURIComponent(rawSlug).toLowerCase();
        const foundCategory: any = await prisma.category.findFirst({
            where: {
                slug: slug,
                parentId: parentId
            },
            include: {
                children: {
                    where: { status: 'active' },
                    orderBy: { order: 'asc' },
                    include: {
                        _count: { select: { products: true } }
                    }
                },
                parent: {
                    select: { id: true, name: true, slug: true }
                }
            }
        });

        if (!foundCategory) {
            return notFound();
        }

        currentCategory = foundCategory;
        parentId = foundCategory.id;
    }

    // Fetch products for this category
    const productsFromDb = await prisma.product.findMany({
        where: {
            categoryId: currentCategory.id,
            status: 'active'
        },
        orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
        ]
    });

    // Build breadcrumb
    const breadcrumb = [];
    let tempCategory: any = currentCategory;
    while (tempCategory) {
        breadcrumb.unshift({
            name: tempCategory.name,
            slug: tempCategory.slug
        });
        tempCategory = tempCategory.parent;
    }

    const initialData = {
        category: {
            id: currentCategory.id,
            name: currentCategory.name,
            slug: currentCategory.slug,
            description: currentCategory.description,
            image: currentCategory.image
        },
        children: currentCategory.children || [],
        products: productsFromDb.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price ? Number(p.price) : null,
            priceUnit: (p as any).priceUnit || null,
            images: p.images ? JSON.parse(p.images) : [],
            features: p.features ? JSON.parse(p.features) : []
        })),
        breadcrumb,
        path: slugPath
    };

    return <ProductCategoryContent initialData={initialData} />;
}
