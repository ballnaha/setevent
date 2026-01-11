import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Public API - Get active promotions only
export async function GET() {
    try {
        const promotions = await prisma.promotion.findMany({
            where: { status: 'active' },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(promotions);
    } catch (error) {
        console.error("Error fetching promotions:", error);
        return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
    }
}
