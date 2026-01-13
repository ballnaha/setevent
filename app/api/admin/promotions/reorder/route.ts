import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/admin/promotions/reorder - Update order of promotions
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderedIds } = body as { orderedIds: string[] };

        if (!orderedIds || !Array.isArray(orderedIds)) {
            return NextResponse.json({ error: "orderedIds array is required" }, { status: 400 });
        }

        // Update order for each promotion
        const updates = orderedIds.map((id, index) =>
            prisma.promotion.update({
                where: { id },
                data: { order: index }
            })
        );

        await prisma.$transaction(updates);

        return NextResponse.json({ success: true, message: "Order updated successfully" });
    } catch (error) {
        console.error("Error reordering promotions:", error);
        return NextResponse.json({ error: "Failed to reorder promotions" }, { status: 500 });
    }
}
