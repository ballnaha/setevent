import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all FAQs (admin)
export async function GET() {
    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
    }
}

// POST - Create new FAQ
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { question, answer, category, status } = body;

        // Get max order
        const maxOrder = await prisma.fAQ.aggregate({
            _max: { order: true }
        });

        const faq = await prisma.fAQ.create({
            data: {
                question,
                answer,
                category: category || "ทั่วไป",
                status: status || "active",
                order: (maxOrder._max.order || 0) + 1
            }
        });

        return NextResponse.json(faq);
    } catch (error) {
        console.error("Error creating FAQ:", error);
        return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
    }
}
