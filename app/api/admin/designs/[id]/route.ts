import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// GET - Get single design
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const design = await prisma.design.findUnique({
            where: { id }
        });

        if (!design) {
            return NextResponse.json({ error: "Design not found" }, { status: 404 });
        }

        return NextResponse.json(design);
    } catch (error) {
        console.error("Error fetching design:", error);
        return NextResponse.json({ error: "Failed to fetch design" }, { status: 500 });
    }
}

// PUT - Update design
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, category, image, description, status, order } = body;

        const design = await prisma.design.update({
            where: { id },
            data: {
                title,
                category,
                image,
                description,
                status,
                order
            }
        });

        // Revalidate the public designs page to show updated content immediately
        revalidatePath('/designs');

        return NextResponse.json(design);
    } catch (error) {
        console.error("Error updating design:", error);
        return NextResponse.json({ error: "Failed to update design" }, { status: 500 });
    }
}

// DELETE - Delete design
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 1. Find the design to get the image path
        const design = await prisma.design.findUnique({
            where: { id },
            select: { image: true }
        });

        if (design?.image) {
            // 2. Delete the file from public folder
            try {
                // Extract relative path from URL (e.g., /uploads/designs/image.jpg -> uploads/designs/image.jpg)
                const relativePath = design.image.startsWith('/') ? design.image.slice(1) : design.image;
                const fs = require('fs/promises');
                const path = require('path');
                const filePath = path.join(process.cwd(), 'public', relativePath);

                await fs.unlink(filePath);
            } catch (fileError) {
                console.warn("Failed to delete image file:", fileError);
                // Continue to delete DB record even if file deletion fails
            }
        }

        // 3. Delete from DB
        await prisma.design.delete({
            where: { id }
        });

        // Revalidate the public designs page to remove deleted content immediately
        revalidatePath('/designs');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting design:", error);
        return NextResponse.json({ error: "Failed to delete design" }, { status: 500 });
    }
}
