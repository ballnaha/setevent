import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET - Get single product
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.valentineProduct.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

// PUT - Update product
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const {
            name,
            category,
            price,
            originalPrice,
            description,
            image,
            isHot,
            isNew,
            status,
            order,
            images
        } = body;

        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // 1. Delete existing images if new images are provided
            if (images && Array.isArray(images)) {
                await tx.valentineProductImage.deleteMany({
                    where: { productId: id }
                });
            }

            // 2. Update product
            return await tx.valentineProduct.update({
                where: { id },
                data: {
                    name,
                    category,
                    price: price !== undefined ? parseFloat(price) : undefined,
                    originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : undefined,
                    description,
                    image,
                    isHot,
                    isNew,
                    status,
                    order: order !== undefined ? parseInt(order) : undefined,
                    images: images && Array.isArray(images) ? {
                        create: images.map((img: any, index: number) => ({
                            url: img.url,
                            order: img.order !== undefined ? parseInt(img.order) : index
                        }))
                    } : undefined
                },
                include: {
                    images: true
                }
            });
        });

        revalidatePath('/valentine/catalog');

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating valentine product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE - Delete product
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.valentineProduct.delete({
            where: { id },
        });

        revalidatePath('/valentine/catalog');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting valentine product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
