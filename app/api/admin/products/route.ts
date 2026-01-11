
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/products - Get all products with optional filters
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const search = searchParams.get("search");

        const where: any = {};
        if (categoryId && categoryId !== 'all') {
            where.categoryId = categoryId;
        }
        if (search) {
            where.name = { contains: search }; // Case sensitive in some DBs, Prisma defaults usually CI on MySQL but depends on collation
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST /api/admin/products - Create new product
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, slug, description, price, priceUnit, categoryId, images, features, status } = body;

        if (!name || !slug || !categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: price ? parseFloat(price) : null,
                priceUnit: priceUnit || null,
                categoryId,
                images: images ? JSON.stringify(images) : null,
                features: features ? JSON.stringify(features) : null,
                status: status || 'active'
            } as any // priceUnit added to schema, run prisma generate
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
