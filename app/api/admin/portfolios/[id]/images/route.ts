import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// GET - list images in an album
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const images = await prisma.portfolioImage.findMany({
      where: { portfolioId: id },
      orderBy: { order: "asc" }
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching portfolio images:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio images" }, { status: 500 });
  }
}

// POST - add image to album
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { url, caption } = body;

    if (!url) {
      return NextResponse.json({ error: "Image url is required" }, { status: 400 });
    }

    const maxOrder = await prisma.portfolioImage.aggregate({
      where: { portfolioId: id },
      _max: { order: true }
    });

    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const image = await prisma.portfolioImage.create({
      data: {
        portfolioId: id,
        url,
        caption: caption || null,
        order: nextOrder
      }
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio image:", error);
    return NextResponse.json({ error: "Failed to create portfolio image" }, { status: 500 });
  }
}

// DELETE - delete single image from album
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { imageId } = await req.json();

    if (!imageId) {
      return NextResponse.json({ error: "imageId is required" }, { status: 400 });
    }

    const image = await prisma.portfolioImage.findUnique({ where: { id: imageId } });

    if (!image || image.portfolioId !== id) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete physical file from uploads folder
    if (image.url && image.url.startsWith('/uploads')) {
      try {
        const relativePath = image.url.substring(1);
        const filepath = path.join(process.cwd(), 'public', relativePath);
        await fs.unlink(filepath).catch((err: any) => {
          if (err.code !== 'ENOENT') console.error('Error deleting image file:', err);
        });
      } catch (err) {
        console.error('File deletion logic error:', err);
      }
    }

    await prisma.portfolioImage.delete({ where: { id: imageId } });

    // re-normalize orders after deletion
    const remaining = await prisma.portfolioImage.findMany({
      where: { portfolioId: id },
      orderBy: { order: "asc" }
    });

    await Promise.all(
      remaining.map((img: { id: string }, index: number) =>
        prisma.portfolioImage.update({
          where: { id: img.id },
          data: { order: index }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio image:", error);
    return NextResponse.json({ error: "Failed to delete portfolio image" }, { status: 500 });
  }
}

// PATCH - reorder images in album
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const items = body as { id: string; order: number }[];

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await Promise.all(
      items.map((item: { id: string; order: number }) =>
        prisma.portfolioImage.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering portfolio images:", error);
    return NextResponse.json({ error: "Failed to reorder portfolio images" }, { status: 500 });
  }
}
