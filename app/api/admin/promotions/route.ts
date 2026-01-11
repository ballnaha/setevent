import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const promotions = await prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(promotions);
    } catch (error) {
        console.error("Error fetching promotions:", error);
        return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, image, price, period, features, status } = body;

        const promotion = await prisma.promotion.create({
            data: {
                title,
                description,
                image,
                price,
                period,
                features: features ? JSON.stringify(features) : null,
                status: status || 'active'
            }
        });

        return NextResponse.json(promotion);
    } catch (error) {
        console.error("Error creating promotion:", error);
        return NextResponse.json({ error: "Failed to create promotion" }, { status: 500 });
    }
}
