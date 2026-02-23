import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// GET - Get single portfolio
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const portfolio = await prisma.portfolio.findUnique({
            where: { id }
        });

        if (!portfolio) {
            return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
        }

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
    }
}

// PUT - Update portfolio
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, category, image, description, status, order, slug } = body;

        // Use title as slug if slug is empty
        const finalSlug: string = (slug && typeof slug === 'string' && slug.trim().length > 0)
            ? slug.trim()
            : (title && typeof title === 'string' ? title.trim() : '');

        // Fetch existing portfolio to handle image cleanup
        const oldPortfolio = await prisma.portfolio.findUnique({
            where: { id }
        });

        if (oldPortfolio?.image && oldPortfolio.image !== image) {
            // Image has changed or been removed, delete old file if it's local
            if (oldPortfolio.image.startsWith('/uploads')) {
                try {
                    const fs = require('fs/promises');
                    const path = require('path');
                    const relativePath = oldPortfolio.image.substring(1);
                    const filepath = path.join(process.cwd(), 'public', relativePath);

                    await fs.unlink(filepath).catch((err: any) => {
                        if (err.code !== 'ENOENT') console.error("Error deleting old file:", err);
                    });
                } catch (err) {
                    console.error("File deletion logic error:", err);
                }
            }
        }

        const portfolio = await prisma.portfolio.update({
            where: { id },
            data: {
                title,
                slug: finalSlug,
                category,
                image,
                description,
                status,
                order
            }
        });

        // Revalidate the public portfolio page to show updated content immediately
        revalidatePath('/portfolio');

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error("Error updating portfolio:", error);
        return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
    }
}

// DELETE - Delete portfolio
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get portfolio to find image path
        const portfolio = await prisma.portfolio.findUnique({
            where: { id },
            include: {
                images: true
            }
        });

        if (portfolio?.image) {
            // Check if it's a local file (starts with /uploads)
            if (portfolio.image.startsWith('/uploads')) {
                try {
                    const fs = require('fs/promises');
                    const path = require('path');
                    // Remove leading slash for path joining
                    const relativePath = portfolio.image.substring(1);
                    const filepath = path.join(process.cwd(), 'public', relativePath);

                    await fs.unlink(filepath).catch((err: any) => {
                        // Ignore if file doesn't exist
                        if (err.code !== 'ENOENT') console.error("Error deleting file:", err);
                    });
                } catch (err) {
                    console.error("File deletion logic error:", err);
                }
            }
        }

        // Delete all album images (files + DB rows)
        if (portfolio?.images && portfolio.images.length > 0) {
            try {
                const fs = require('fs/promises');
                const path = require('path');

                for (const img of portfolio.images) {
                    if (img.url && typeof img.url === 'string' && img.url.startsWith('/uploads')) {
                        const relativePath = img.url.substring(1);
                        const filepath = path.join(process.cwd(), 'public', relativePath);

                        await fs.unlink(filepath).catch((err: any) => {
                            if (err.code !== 'ENOENT') console.error("Error deleting file:", err);
                        });
                    }
                }
            } catch (err) {
                console.error("Album images file deletion logic error:", err);
            }

            await prisma.portfolioImage.deleteMany({
                where: { portfolioId: id }
            });
        }

        await prisma.portfolio.delete({
            where: { id }
        });

        // Revalidate the public portfolio page to remove deleted content immediately
        revalidatePath('/portfolio');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting portfolio:", error);
        return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 });
    }
}
