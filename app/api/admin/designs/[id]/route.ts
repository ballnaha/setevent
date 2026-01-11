import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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

        await prisma.design.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting design:", error);
        return NextResponse.json({ error: "Failed to delete design" }, { status: 500 });
    }
}
