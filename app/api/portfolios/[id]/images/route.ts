import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - public list of images for a portfolio album
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const images = await prisma.portfolioImage.findMany({
      where: { portfolioId: id },
      orderBy: { order: "asc" },
      select: {
        id: true,
        url: true,
        caption: true,
        order: true,
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching public portfolio images:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio images" }, { status: 500 });
  }
}
