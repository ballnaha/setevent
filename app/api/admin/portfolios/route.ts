import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// GET - List all portfolios for admin
export async function GET() {
    try {
        const portfolios = await prisma.portfolio.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(portfolios);
    } catch (error) {
        console.error("Error fetching portfolios:", error);
        return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 });
    }
}

// POST - Create new portfolio
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, category, image, description, status } = body;

        if (!title || !category) {
            return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
        }

        const portfolio = await prisma.portfolio.create({
            data: {
                title,
                category,
                image: image || null,
                description: description || null,
                status: status || "active"
            }
        });

        // Revalidate the public portfolio page to show new content immediately
        revalidatePath('/portfolio');

        return NextResponse.json(portfolio, { status: 201 });
    } catch (error) {
        console.error("Error creating portfolio:", error);
        return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 });
    }
}
