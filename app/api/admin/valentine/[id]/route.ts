import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// GET - Get single valentine card with memories
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const card = await prisma.valentineCard.findUnique({
            where: { id },
            include: {
                memories: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!card) {
            return NextResponse.json({ error: "Valentine card not found" }, { status: 404 });
        }

        return NextResponse.json(card);
    } catch (error) {
        console.error("Error fetching valentine card:", error);
        return NextResponse.json({ error: "Failed to fetch valentine card" }, { status: 500 });
    }
}

// PUT - Update valentine card and its memories
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const {
            slug, jobName, title, openingText, greeting, subtitle, message,
            signer, backgroundColor, backgroundMusicYoutubeId, backgroundMusicUrl, status, memories
        } = body;

        // Update main card data
        const card = await prisma.valentineCard.update({
            where: { id },
            data: {
                slug,
                jobName,
                title,
                openingText,
                greeting,
                subtitle,
                message,
                signer,
                backgroundColor,
                backgroundMusicYoutubeId,
                backgroundMusicUrl,
                status
            }
        });

        // Delete specified files if urlsToDelete is provided (handle both memories and music)
        const { urlsToDelete } = body;
        if (urlsToDelete && Array.isArray(urlsToDelete)) {
            const fs = require('fs/promises');
            const path = require('path');
            for (const url of urlsToDelete) {
                if (url && url.startsWith('/uploads')) {
                    try {
                        const filepath = path.join(process.cwd(), 'public', url.substring(1));
                        await fs.unlink(filepath).catch((err: any) => {
                            if (err.code !== 'ENOENT') console.error("Error deleting file:", err);
                        });
                    } catch (err) {
                        console.error("File deletion logic error:", err);
                    }
                }
            }
        }

        // Handle memories update if provided
        if (memories && Array.isArray(memories)) {

            // Simple approach: delete all and recreate
            await prisma.valentineMemory.deleteMany({
                where: { cardId: id }
            });

            if (memories.length > 0) {
                await prisma.valentineMemory.createMany({
                    data: memories.map((m: any, index: number) => ({
                        cardId: id,
                        type: m.type || 'image',
                        url: m.url,
                        caption: m.caption,
                        thumbnail: m.thumbnail,
                        order: m.order ?? index
                    }))
                });
            }
        }

        revalidatePath('/valentine');
        revalidatePath(`/valentine/${slug}`);

        return NextResponse.json(card);
    } catch (error: any) {
        console.error("Error updating valentine card:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update valentine card" }, { status: 500 });
    }
}

// DELETE - Delete valentine card
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const card = await prisma.valentineCard.findUnique({
            where: { id },
            include: { memories: true }
        });

        if (!card) {
            return NextResponse.json({ error: "Valentine card not found" }, { status: 404 });
        }

        // Delete associated image files
        const fs = require('fs/promises');
        const path = require('path');
        for (const memory of card.memories) {
            if (memory.type === 'image' && memory.url.startsWith('/uploads')) {
                try {
                    const filepath = path.join(process.cwd(), 'public', memory.url.substring(1));
                    await fs.unlink(filepath).catch((err: any) => {
                        if (err.code !== 'ENOENT') console.error("Error deleting file:", err);
                    });
                } catch (err) {
                    console.error("File deletion error:", err);
                }
            }
        }

        // Delete background music file
        if (card.backgroundMusicUrl && card.backgroundMusicUrl.startsWith('/uploads')) {
            try {
                const filepath = path.join(process.cwd(), 'public', card.backgroundMusicUrl.substring(1));
                await fs.unlink(filepath).catch((err: any) => {
                    if (err.code !== 'ENOENT') console.error("Error deleting music file:", err);
                });
            } catch (err) {
                console.error("Music file deletion error:", err);
            }
        }

        await prisma.valentineCard.delete({
            where: { id }
        });

        revalidatePath('/valentine');
        revalidatePath(`/valentine/${card.slug}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting valentine card:", error);
        return NextResponse.json({ error: "Failed to delete valentine card" }, { status: 500 });
    }
}
