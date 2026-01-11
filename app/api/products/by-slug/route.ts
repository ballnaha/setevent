import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/by-slug - Get category and products by slug path
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slugPath = searchParams.get('path'); // e.g., "rental/led-screen/indoor"

        if (!slugPath) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        const slugs = slugPath.split('/').filter(Boolean);

        if (slugs.length === 0) {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 });
        }

        // Find category by traversing the slug path
        let currentCategory = null;
        let parentId: string | null = null;

        for (const slug of slugs) {
            const category = await prisma.category.findFirst({
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

            if (!category) {
                return NextResponse.json({
                    error: "Category not found",
                    slug: slug,
                    path: slugPath
                }, { status: 404 });
            }

            currentCategory = category;
            parentId = category.id;
        }

        if (!currentCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Fetch products for this category
        const products = await prisma.product.findMany({
            where: {
                categoryId: currentCategory.id,
                status: 'active'
            },
            orderBy: { order: 'asc' }
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

        return NextResponse.json({
            success: true,
            category: {
                id: currentCategory.id,
                name: currentCategory.name,
                slug: currentCategory.slug,
                description: currentCategory.description,
                image: currentCategory.image
            },
            children: currentCategory.children || [],
            products: products.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                description: p.description,
                price: p.price,
                priceUnit: (p as any).priceUnit || null,
                images: p.images ? JSON.parse(p.images) : [],
                features: p.features ? JSON.parse(p.features) : []
            })),
            breadcrumb,
            path: slugPath
        });
    } catch (error) {
        console.error("Error fetching products by slug:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
