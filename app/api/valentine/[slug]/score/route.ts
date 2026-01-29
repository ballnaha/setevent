import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const card = await prisma.valentineCard.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!card) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const pId = searchParams.get('playerId');

        const totalPlayers = await prisma.valentineScore.count({
            where: { cardId: card.id }
        });

        const topScores = await prisma.valentineScore.findMany({
            where: { cardId: card.id },
            orderBy: { score: 'desc' },
            take: 10,
            select: {
                id: true,
                playerId: true,
                name: true,
                score: true,
                createdAt: true
            }
        });

        let userRank = null;
        if (pId) {
            const userScore = await prisma.valentineScore.findUnique({
                where: { cardId_playerId: { cardId: card.id, playerId: pId } }
            });

            if (userScore) {
                const countHigher = await prisma.valentineScore.count({
                    where: {
                        cardId: card.id,
                        score: { gt: userScore.score }
                    }
                });
                userRank = countHigher + 1;
            }
        }

        return NextResponse.json({
            scores: topScores,
            totalPlayers,
            userRank
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const { playerId, name, score, duration } = await request.json();

        // Validation Logic
        const scoreInt = parseInt(score);
        const durationInt = parseInt(duration) || 1;

        if (!playerId || !name || score === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Anti-Cheat Check
        const maxPlausibleScore = (durationInt * 250) + 550;
        if (scoreInt > maxPlausibleScore && scoreInt > 500) {
            console.warn(`Cheating detected: ${name} submitted ${scoreInt} for ${durationInt}s`);
            return NextResponse.json({ error: 'Invalid score detected' }, { status: 403 });
        }

        if (durationInt < 3 && scoreInt > 100) {
            return NextResponse.json({ error: 'Too fast!' }, { status: 403 });
        }

        const card = await prisma.valentineCard.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!card) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        // 1. Check if name is already taken by ANOTHER player
        const nameTaken = await prisma.valentineScore.findFirst({
            where: {
                cardId: card.id,
                name: name,
                playerId: { not: playerId }
            }
        });

        if (nameTaken) {
            return NextResponse.json({ error: 'ชื่อนี้มีคนใช้แล้ว ลองชื่ออื่นดูนะ!' }, { status: 409 });
        }

        // 2. UPSERT logic based on playerId and cardId
        const existingScore = await prisma.valentineScore.findFirst({
            where: {
                cardId: card.id,
                playerId: playerId
            }
        });

        let result;
        if (existingScore) {
            // Update name always (if changed) but only update score if it's higher
            result = await prisma.valentineScore.update({
                where: { id: existingScore.id },
                data: {
                    name: name,
                    score: scoreInt > existingScore.score ? scoreInt : existingScore.score
                }
            });
        } else {
            result = await prisma.valentineScore.create({
                data: {
                    cardId: card.id,
                    playerId,
                    name,
                    score: scoreInt
                }
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error submitting score:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
