import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Check if blog exists first (optional but good)
        const blog = await prisma.blog.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Increment views
        await prisma.blog.update({
            where: { slug },
            data: { views: { increment: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error incrementing view:', error);
        return NextResponse.json({ error: 'Failed to increment view' }, { status: 500 });
    }
}
