import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, description, image, price, period, features, status } = body;

        const promotion = await prisma.promotion.update({
            where: { id },
            data: {
                title,
                description,
                image,
                price,
                period,
                features: features ? JSON.stringify(features) : null,
                status
            }
        });

        return NextResponse.json(promotion);
    } catch (error) {
        console.error("Error updating promotion:", error);
        return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.promotion.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting promotion:", error);
        return NextResponse.json({ error: "Failed to delete promotion" }, { status: 500 });
    }
}
