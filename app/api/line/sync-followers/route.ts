import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

async function getLineFollowers(next?: string) {
    const url = new URL('https://api.line.me/v2/bot/followers/ids');
    if (next) url.searchParams.append('start', next);

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        console.error(`LINE API Error (${res.status}):`, text);

        if (res.status === 403 || res.status === 401) {
            throw new Error('REQ_VERIFIED_ACCOUNT');
        }

        throw new Error(`Failed to fetch followers from LINE: ${res.status} ${res.statusText} - ${text}`);
    }

    return res.json();
}

async function getUserProfile(userId: string) {
    const res = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
        headers: {
            Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        console.error(`Failed to fetch profile for ${userId}`);
        return null;
    }

    return res.json();
}

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!LINE_ACCESS_TOKEN) {
            return NextResponse.json({ error: 'LINE Channel Access Token not configured' }, { status: 500 });
        }

        // 1. Get all follower IDs (Handling pagination simply for now, or just one page)
        // Note: Production should handle 'next' token for pagination.
        let allUserIds: string[] = [];
        let nextToken: string | undefined = undefined;

        // Fetch at least one page. Loop if needed (be careful of rate limits)
        do {
            const data: any = await getLineFollowers(nextToken);
            allUserIds = [...allUserIds, ...data.userIds];
            nextToken = data.next;
        } while (nextToken && allUserIds.length < 1000); // Limit to 1000 for safety in this iteration

        console.log(`Found ${allUserIds.length} followers. Syncing...`);

        let syncedCount = 0;
        let newCount = 0;

        // 2. Fetch profiles and upsert
        // We do this in chunks to avoid overwhelming everything
        const chunkSize = 10;
        for (let i = 0; i < allUserIds.length; i += chunkSize) {
            const chunk = allUserIds.slice(i, i + chunkSize);

            await Promise.all(chunk.map(async (userId) => {
                const profile = await getUserProfile(userId);
                if (profile) {
                    const existing = await prisma.customer.findUnique({ where: { lineUid: userId } });

                    if (!existing) {
                        await prisma.customer.create({
                            data: {
                                lineUid: userId,
                                displayName: profile.displayName,
                                pictureUrl: profile.pictureUrl,
                                status: 'new',
                            }
                        });
                        newCount++;
                    } else {
                        // Optional: Update display name/picture if changed
                        await prisma.customer.update({
                            where: { id: existing.id },
                            data: {
                                displayName: profile.displayName,
                                pictureUrl: profile.pictureUrl,
                            }
                        });
                    }
                    syncedCount++;
                }
            }));
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${syncedCount} users (${newCount} new).`,
            total: syncedCount,
            new: newCount
        });

    } catch (error: any) {
        console.error('Sync Error:', error);

        if (error.message === 'REQ_VERIFIED_ACCOUNT') {
            return NextResponse.json({
                error: 'ไม่สามารถดึงข้อมูลผู้ติดตามได้: บัญชี LINE OA ของคุณต้องเป็นบัญชีที่ผ่านการรับรอง (Verified) หรือ Premium เท่านั้น'
            }, { status: 403 });
        }

        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
