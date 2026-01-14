import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Public API - Get active promotions only
export async function GET() {
    try {
        const promotions = await prisma.promotion.findMany({
            where: { status: 'active' },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(promotions);
    } catch (error) {
        console.error("Error fetching promotions:", error);
        return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
    }
}
