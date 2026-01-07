/**
 * LINE Messaging API Utility
 * ใช้สำหรับส่งข้อความ/รูปภาพถึงลูกค้าผ่าน LINE
 */

const LINE_PUSH_API = 'https://api.line.me/v2/bot/message/push';
const LINE_MULTICAST_API = 'https://api.line.me/v2/bot/message/multicast';
const LINE_BROADCAST_API = 'https://api.line.me/v2/bot/message/broadcast';

// Message Types
export interface TextMessage {
    type: 'text';
    text: string;
}

export interface ImageMessage {
    type: 'image';
    originalContentUrl: string;
    previewImageUrl: string;
}

export interface VideoMessage {
    type: 'video';
    originalContentUrl: string;
    previewImageUrl: string;
}

export interface StickerMessage {
    type: 'sticker';
    packageId: string;
    stickerId: string;
}

export interface FlexMessage {
    type: 'flex';
    altText: string;
    contents: FlexContainer;
}

export interface FlexContainer {
    type: 'bubble' | 'carousel';
    body?: any;
    header?: any;
    footer?: any;
    contents?: any[];
}

export type LineMessage = TextMessage | ImageMessage | VideoMessage | StickerMessage | FlexMessage;

// Response Types
export interface LineApiResponse {
    success: boolean;
    error?: string;
}

/**
 * ส่งข้อความถึง User คนเดียว (Push Message)
 */
export async function pushMessage(lineUid: string, messages: LineMessage[]): Promise<LineApiResponse> {
    try {
        const response = await fetch(LINE_PUSH_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                to: lineUid,
                messages: messages.slice(0, 5), // LINE จำกัด 5 ข้อความต่อครั้ง
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('LINE Push Error:', error);
            return { success: false, error: JSON.stringify(error) };
        }

        return { success: true };
    } catch (error) {
        console.error('LINE Push Exception:', error);
        return { success: false, error: String(error) };
    }
}

/**
 * ส่งข้อความถึง Users หลายคน (Multicast)
 */
export async function multicastMessage(lineUids: string[], messages: LineMessage[]): Promise<LineApiResponse> {
    try {
        const response = await fetch(LINE_MULTICAST_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                to: lineUids.slice(0, 500), // LINE จำกัด 500 คนต่อครั้ง
                messages: messages.slice(0, 5),
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('LINE Multicast Error:', error);
            return { success: false, error: JSON.stringify(error) };
        }

        return { success: true };
    } catch (error) {
        console.error('LINE Multicast Exception:', error);
        return { success: false, error: String(error) };
    }
}

/**
 * ส่งข้อความถึงทุกคน (Broadcast)
 */
export async function broadcastMessage(messages: LineMessage[]): Promise<LineApiResponse> {
    try {
        const response = await fetch(LINE_BROADCAST_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                messages: messages.slice(0, 5),
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('LINE Broadcast Error:', error);
            return { success: false, error: JSON.stringify(error) };
        }

        return { success: true };
    } catch (error) {
        console.error('LINE Broadcast Exception:', error);
        return { success: false, error: String(error) };
    }
}

// ============ Helper Functions ============

/**
 * ส่งข้อความ Text ธรรมดา
 */
export async function sendText(lineUid: string, text: string) {
    return pushMessage(lineUid, [{ type: 'text', text }]);
}

/**
 * ส่งรูปภาพ
 */
export async function sendImage(lineUid: string, imageUrl: string, previewUrl?: string) {
    return pushMessage(lineUid, [{
        type: 'image',
        originalContentUrl: imageUrl,
        previewImageUrl: previewUrl || imageUrl,
    }]);
}

/**
 * ส่งวิดีโอ
 */
export async function sendVideo(lineUid: string, videoUrl: string, previewUrl: string) {
    return pushMessage(lineUid, [{
        type: 'video',
        originalContentUrl: videoUrl,
        previewImageUrl: previewUrl,
    }]);
}

/**
 * ส่ง Sticker
 */
export async function sendSticker(lineUid: string, packageId: string, stickerId: string) {
    return pushMessage(lineUid, [{
        type: 'sticker',
        packageId,
        stickerId,
    }]);
}

/**
 * ส่ง Event Card (Flex Message)
 */
export async function sendEventCard(
    lineUid: string,
    eventName: string,
    eventDate: string,
    venue: string,
    liffUrl: string
) {
    return pushMessage(lineUid, [{
        type: 'flex',
        altText: `รายละเอียดงาน: ${eventName}`,
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'md',
                contents: [
                    {
                        type: 'text',
                        text: '🎉 SETEVENT',
                        size: 'xs',
                        color: '#0A5C5A',
                        weight: 'bold',
                    },
                    {
                        type: 'text',
                        text: eventName,
                        size: 'xl',
                        weight: 'bold',
                        wrap: true,
                    },
                    {
                        type: 'separator',
                        margin: 'lg',
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
                        margin: 'lg',
                        contents: [
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    { type: 'text', text: '📅', size: 'sm', flex: 0 },
                                    { type: 'text', text: eventDate, size: 'sm', color: '#666666', flex: 5 },
                                ],
                            },
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    { type: 'text', text: '📍', size: 'sm', flex: 0 },
                                    { type: 'text', text: venue, size: 'sm', color: '#666666', flex: 5, wrap: true },
                                ],
                            },
                        ],
                    },
                ],
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                    {
                        type: 'button',
                        action: {
                            type: 'uri',
                            label: 'ดูรายละเอียด',
                            uri: liffUrl,
                        },
                        style: 'primary',
                        color: '#0A5C5A',
                    },
                ],
            },
        },
    }]);
}

/**
 * ส่งข้อความแจ้งเตือนสถานะงาน
 */
export async function sendStatusNotification(
    lineUid: string,
    eventName: string,
    status: 'confirmed' | 'in-progress' | 'completed',
    message?: string
) {
    const statusEmoji = {
        'confirmed': '✅',
        'in-progress': '🔄',
        'completed': '🎉',
    };

    const statusText = {
        'confirmed': 'ยืนยันการจองแล้ว',
        'in-progress': 'กำลังดำเนินการ',
        'completed': 'งานเสร็จสิ้น',
    };

    const text = `${statusEmoji[status]} ${statusText[status]}\n\n📋 งาน: ${eventName}${message ? `\n\n${message}` : ''}`;

    return sendText(lineUid, text);
}

/**
 * ส่งใบเสนอราคา
 */
export async function sendQuotation(
    lineUid: string,
    eventName: string,
    totalPrice: number,
    pdfUrl: string,
    liffUrl: string
) {
    return pushMessage(lineUid, [{
        type: 'flex',
        altText: `ใบเสนอราคา: ${eventName}`,
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'md',
                contents: [
                    {
                        type: 'text',
                        text: '📄 ใบเสนอราคา',
                        size: 'lg',
                        weight: 'bold',
                        color: '#0A5C5A',
                    },
                    {
                        type: 'text',
                        text: eventName,
                        size: 'md',
                        wrap: true,
                        margin: 'md',
                    },
                    {
                        type: 'separator',
                        margin: 'lg',
                    },
                    {
                        type: 'box',
                        layout: 'horizontal',
                        margin: 'lg',
                        contents: [
                            { type: 'text', text: 'ยอดรวม', size: 'md', color: '#555555' },
                            { type: 'text', text: `฿${totalPrice.toLocaleString()}`, size: 'lg', weight: 'bold', align: 'end' },
                        ],
                    },
                ],
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                    {
                        type: 'button',
                        action: {
                            type: 'uri',
                            label: 'ดูใบเสนอราคา',
                            uri: liffUrl,
                        },
                        style: 'primary',
                        color: '#0A5C5A',
                    },
                    {
                        type: 'button',
                        action: {
                            type: 'uri',
                            label: 'ดาวน์โหลด PDF',
                            uri: pdfUrl,
                        },
                        style: 'secondary',
                    },
                ],
            },
        },
    }]);
}
