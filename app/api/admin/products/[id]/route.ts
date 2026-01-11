
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Use RouteParams interface for type safety with params Promise
interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, slug, description, price, priceUnit, categoryId, images, features, status } = body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                price: price ? parseFloat(price) : null,
                priceUnit: priceUnit || null,
                categoryId,
                images: images ? JSON.stringify(images) : null,
                features: features ? JSON.stringify(features) : null,
                status
            } as any // priceUnit added to schema, run prisma generate
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
