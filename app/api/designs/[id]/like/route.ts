import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action'); // 'like' or 'unlike'

        const incrementValue = action === 'unlike' ? -1 : 1;

        const design = await prisma.design.update({
            where: { id },
            data: { likes: { increment: incrementValue } },
            select: { likes: true }
        });

        // Ensure likes don't go below zero (sanity check)
        if (design.likes < 0) {
            await prisma.design.update({
                where: { id },
                data: { likes: 0 }
            });
            design.likes = 0;
        }

        return NextResponse.json({ success: true, likes: design.likes });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to like design' }, { status: 500 });
    }
}
