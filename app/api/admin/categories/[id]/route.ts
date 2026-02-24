
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// params is a Promise in Next.js 15+, but in 14 it's an object. 
// However, the types provided usually expect params to be awaited or treated carefully.
// Standard pattern:

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, slug, description, image, parentId, status, order } = body;

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug: slug?.toLowerCase(),
                description,
                image,
                parentId: parentId || null,
                status,
                order: order ? parseInt(order) : undefined
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await prisma.category.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
