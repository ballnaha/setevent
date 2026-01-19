import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const valentine = await prisma.valentineCard.findFirst({
            where: {
                slug: slug,
                status: 'active'
            },
            include: {
                memories: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        if (!valentine) {
            return NextResponse.json(
                { error: 'Valentine card not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(valentine);
    } catch (error) {
        console.error('Error fetching valentine card:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
