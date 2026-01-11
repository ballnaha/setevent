import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Get single portfolio
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const portfolio = await prisma.portfolio.findUnique({
            where: { id }
        });

        if (!portfolio) {
            return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
        }

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
    }
}

// PUT - Update portfolio
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, category, image, description, status, order } = body;

        const portfolio = await prisma.portfolio.update({
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

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error("Error updating portfolio:", error);
        return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
    }
}

// DELETE - Delete portfolio
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.portfolio.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting portfolio:", error);
        return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 });
    }
}
