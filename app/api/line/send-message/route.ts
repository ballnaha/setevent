import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendText, sendImage, sendEventCard, sendStatusNotification, sendQuotation, sendAdminMessage, pushMessage, LineMessage, createStatusFlexMessage } from '@/lib/line-messaging';

// POST /api/line/send-message
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customerId, lineUid, type, eventId, ...data } = body;

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
                // ส่งรูปภาพ (และข้อความถ้ามี)
                // body: { type: 'image', imageUrl: 'https://...', previewUrl?: 'https://...', text?: 'คำอธิบาย...' }

                const imageMessages: LineMessage[] = [];

                if (data.imageUrls && Array.isArray(data.imageUrls)) {
                    data.imageUrls.forEach((url: string) => {
                        imageMessages.push({
                            type: 'image',
                            originalContentUrl: url,
                            previewImageUrl: url,
                        });
                    });
                } else if (data.imageUrl) {
                    imageMessages.push({
                        type: 'image',
                        originalContentUrl: data.imageUrl,
                        previewImageUrl: data.previewUrl || data.imageUrl,
                    });
                }

                if (data.text) {
                    imageMessages.push({
                        type: 'text',
                        text: data.text,
                    });
                }

                if (imageMessages.length > 0) {
                    // LINE allow max 5 messages
                    result = await pushMessage(targetLineUid, imageMessages.slice(0, 5));
                } else {
                    return NextResponse.json({ error: 'No image or text provided' }, { status: 400 });
                }
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
                // body: { type: 'status', eventName, status: 'confirmed'|'in-progress'|'completed', message?, imageUrls?: string[] }

                // 1. Create Status Flex Message
                // Fetch inviteCode if eventId is provided
                let inviteCode = data.inviteCode;
                if (eventId && !inviteCode) {
                    const event = await prisma.event.findUnique({
                        where: { id: eventId },
                        select: { inviteCode: true }
                    });
                    if (event) inviteCode = event.inviteCode;
                }

                // Ensure date is formatted if present
                let formattedDate = data.eventDate;
                if (data.eventDate && !data.eventDateNormalized) {
                    try {
                        const d = new Date(data.eventDate);
                        formattedDate = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
                        if (d.getHours() > 0 || d.getMinutes() > 0) {
                            formattedDate += ` ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`;
                        }
                    } catch (e) { }
                }

                const statusFlex = createStatusFlexMessage(data.eventName, data.status, data.message, data.progress, data.senderName, data.venue, formattedDate, inviteCode);
                const statusMessages: LineMessage[] = [statusFlex];

                // 2. Add Images (if any)
                if (data.imageUrls && Array.isArray(data.imageUrls)) {
                    data.imageUrls.forEach((url: string) => {
                        // Use original URL for preview to avoid broken images on desktop
                        // LINE Desktop sometimes has issues with specific thumbnail URLs if they don't exist
                        statusMessages.push({
                            type: 'image',
                            originalContentUrl: url,
                            previewImageUrl: url,
                        });
                    });
                } else if (data.imageUrl) {
                    statusMessages.push({
                        type: 'image',
                        originalContentUrl: data.imageUrl,
                        previewImageUrl: data.imageUrl,
                    });
                }

                // 3. Add Work Files (if any)
                if (data.files && Array.isArray(data.files)) {
                    data.files.forEach((file: { name: string, url: string }) => {
                        // Send as text message with Link
                        statusMessages.push({
                            type: 'text',
                            text: `📄 ส่งไฟล์งาน: ${file.name}\n${file.url}`
                        });
                    });
                }

                // 3. Push All Messages (Max 5)
                result = await pushMessage(targetLineUid, statusMessages.slice(0, 5));
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

            case 'admin-message':
                // ส่งข้อความจากผู้ดูแล
                // body: { type: 'admin-message', subject, message, imageUrl?, actionUrl?, actionLabel? }
                result = await sendAdminMessage(
                    targetLineUid,
                    data.subject,
                    data.message,
                    data.imageUrl,
                    data.actionUrl,
                    data.actionLabel
                );
                break;

            case 'chat':
                // ส่งข้อความโต้ตอบธรรมดา (ไม่มี status card)
                // body: { type: 'chat', message: string, imageUrls?: string[], files?: array }
                const chatMessages: LineMessage[] = [];

                // Add text message
                if (data.message) {
                    chatMessages.push({
                        type: 'text',
                        text: data.message
                    });
                }

                // Add images
                if (data.imageUrls && Array.isArray(data.imageUrls)) {
                    data.imageUrls.forEach((url: string) => {
                        const previewUrl = url.replace(/(\.[\\w\\d]+)$/, '_thumb$1');
                        chatMessages.push({
                            type: 'image',
                            originalContentUrl: url,
                            previewImageUrl: previewUrl,
                        });
                    });
                }

                // Add files
                if (data.files && Array.isArray(data.files)) {
                    data.files.forEach((file: { name: string, url: string }) => {
                        chatMessages.push({
                            type: 'text',
                            text: `📄 ไฟล์แนบ: ${file.name}\n${file.url}`
                        });
                    });
                }

                if (chatMessages.length === 0) {
                    return NextResponse.json({ error: 'No message content' }, { status: 400 });
                }

                result = await pushMessage(targetLineUid, chatMessages.slice(0, 5));
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
                eventId: eventId || null,
            },
        }).catch(() => { }); // Ignore if customer doesn't exist

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
