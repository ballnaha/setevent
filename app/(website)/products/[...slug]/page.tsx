import { Metadata } from 'next';
import ProductCategoryContent from './ProductCategoryContent';
import { prisma } from "@/lib/prisma";

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
        const slug = slugs[i];
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

export default function ProductCategoryPage() {
    return <ProductCategoryContent />;
}
