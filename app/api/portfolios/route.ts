import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - List all active portfolios for public (frontend)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const where: Record<string, unknown> = {
            status: 'active'
        };

        if (category && category !== 'All') {
            where.category = category;
        }

        const portfolios = await prisma.portfolio.findMany({
            where,
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                title: true,
                category: true,
                image: true,
                likes: true,
                views: true,
                createdAt: true
            }
        });

        return NextResponse.json(portfolios);
    } catch (error) {
        console.error("Error fetching portfolios:", error);
        return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 });
    }
}
