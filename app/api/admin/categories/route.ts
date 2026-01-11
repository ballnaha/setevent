
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: {
                    select: { id: true, name: true }
                },
                _count: {
                    select: { products: true, children: true }
                }
            },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

// POST /api/admin/categories
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, slug, description, image, parentId } = body;

        // Basic validation
        if (!name || !slug) {
            return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
                parentId: parentId || null
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        // Handle unique constraint violation for slug
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
