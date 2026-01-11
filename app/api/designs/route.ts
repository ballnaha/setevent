import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - List all active designs for public (frontend)
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

        const designs = await prisma.design.findMany({
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

        return NextResponse.json(designs);
    } catch (error) {
        console.error("Error fetching designs:", error);
        return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 });
    }
}
