
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Use RouteParams interface for type safety with params Promise
interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, slug, description, price, priceUnit, categoryId, images, features, status } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug.toLowerCase();
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price ? parseFloat(price) : null;
        if (priceUnit !== undefined) updateData.priceUnit = priceUnit;
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (images !== undefined) updateData.images = images ? JSON.stringify(images) : null;
        if (features !== undefined) updateData.features = features ? JSON.stringify(features) : null;
        if (status !== undefined) updateData.status = status;

        const product = await prisma.product.update({
            where: { id },
            data: updateData
        });

        // Revalidate the public products pages
        revalidatePath('/products');

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

        // Revalidate the public products pages
        revalidatePath('/products');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
