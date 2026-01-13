import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch active FAQs (public)
export async function GET() {
    try {
        const faqs = await prisma.fAQ.findMany({
            where: { status: 'active' },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                question: true,
                answer: true,
                category: true
            }
        });
        return NextResponse.json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
    }
}
