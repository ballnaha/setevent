import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendText, sendImage, sendEventCard, sendStatusNotification, sendQuotation, pushMessage, LineMessage } from '@/lib/line-messaging';

// POST /api/line/send-message
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customerId, lineUid, type, ...data } = body;

        // ถ้าส่ง customerId มา ให้หา lineUid จาก database
        let targetLineUid = lineUid;
        if (customerId && !lineUid) {
            const customer = await prisma.customer.findUnique({
                where: { id: customerId },
                select: { lineUid: true },
            });
            if (!customer) {
                return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
            }
            targetLineUid = customer.lineUid;
        }

        if (!targetLineUid) {
            return NextResponse.json({ error: 'LINE UID is required' }, { status: 400 });
        }

        let result;

        switch (type) {
            case 'text':
                // ส่งข้อความ Text
                // body: { type: 'text', text: 'ข้อความ' }
                result = await sendText(targetLineUid, data.text);
                break;

            case 'image':
                // ส่งรูปภาพ
                // body: { type: 'image', imageUrl: 'https://...', previewUrl?: 'https://...' }
                result = await sendImage(targetLineUid, data.imageUrl, data.previewUrl);
                break;

            case 'event-card':
                // ส่ง Event Card
                // body: { type: 'event-card', eventName, eventDate, venue, liffUrl }
                result = await sendEventCard(
                    targetLineUid,
                    data.eventName,
                    data.eventDate,
                    data.venue,
                    data.liffUrl
                );
                break;

            case 'status':
                // ส่งแจ้งเตือนสถานะ
                // body: { type: 'status', eventName, status: 'confirmed'|'in-progress'|'completed', message? }
                result = await sendStatusNotification(
                    targetLineUid,
                    data.eventName,
                    data.status,
                    data.message
                );
                break;

            case 'quotation':
                // ส่งใบเสนอราคา
                // body: { type: 'quotation', eventName, totalPrice, pdfUrl, liffUrl }
                result = await sendQuotation(
                    targetLineUid,
                    data.eventName,
                    data.totalPrice,
                    data.pdfUrl,
                    data.liffUrl
                );
                break;

            case 'custom':
                // ส่ง Custom Messages
                // body: { type: 'custom', messages: LineMessage[] }
                result = await pushMessage(targetLineUid, data.messages);
                break;

            default:
                return NextResponse.json({ error: 'Invalid message type' }, { status: 400 });
        }

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // บันทึก log
        await prisma.chatLog.create({
            data: {
                customerId: customerId || 'unknown',
                message: JSON.stringify({ type, ...data }),
                direction: 'outbound',
                messageType: type,
            },
        }).catch(() => { }); // Ignore if customer doesn't exist

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
