import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET - List all designs for admin
export async function GET() {
    try {
        const designs = await prisma.design.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(designs);
    } catch (error) {
        console.error("Error fetching designs:", error);
        return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 });
    }
}

// POST - Create new design
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, category, image, description, status } = body;

        if (!title || !category) {
            return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
        }

        const design = await prisma.design.create({
            data: {
                title,
                category,
                image: image || null,
                description: description || null,
                status: status || "active"
            }
        });

        // Revalidate the public designs page to show new content immediately
        revalidatePath('/designs');

        return NextResponse.json(design, { status: 201 });
    } catch (error) {
        console.error("Error creating design:", error);
        return NextResponse.json({ error: "Failed to create design" }, { status: 500 });
    }
}

