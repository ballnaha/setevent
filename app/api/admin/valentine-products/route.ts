import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET - List all products for admin
export async function GET() {
    try {
        const products = await prisma.valentineProduct.findMany({
            include: {
                images: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching valentine products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST - Create new product
export async function POST(req: NextRequest) {
    try {
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

        if (!name || price === undefined) {
            return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
        }

        const product = await prisma.valentineProduct.create({
            data: {
                name,
                category: category || "General",
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                description,
                image,
                isHot: isHot || false,
                isNew: isNew || false,
                status: status || "active",
                order: order !== undefined ? parseInt(order) : 0,
                images: {
                    create: images && Array.isArray(images) ? images.map((img: any, index: number) => ({
                        url: img.url,
                        order: img.order !== undefined ? parseInt(img.order) : index
                    })) : []
                }
            },
            include: {
                images: true
            }
        });

        revalidatePath('/valentine/catalog');

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating valentine product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
