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
 * สร้าง Flex Message สำหรับแจ้งเตือนสถานะ
 */
export function createStatusFlexMessage(
    eventName: string,
    status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled',
    message?: string,
    progress?: number,
    senderName?: string,
    venue?: string,
    eventDate?: string
): FlexMessage {
    const statusConfig: Record<string, any> = {
        'in-progress': {
            label: 'กำลังดำเนินการ',
            color: '#F59E0B',
            bgColor: '#FFF7ED',
            barColor: '#F59E0B'
        },
        'completed': {
            label: 'ปิดงาน',
            color: '#10B981',
            bgColor: '#ECFDF5',
            barColor: '#10B981'
        },
        'cancelled': {
            label: 'ยกเลิก',
            color: '#EF4444',
            bgColor: '#FEF2F2',
            barColor: '#EF4444'
        }
    };

    const config = statusConfig[status] || statusConfig['in-progress'];

    // Ensure progress is within 0-100 if provided
    const validProgress = progress !== undefined ? Math.max(0, Math.min(100, progress)) : undefined;

    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // 2. Main Content Area - Construct contents array dynamically to avoid spread issues
    const mainContents: any[] = [
        // Header: Status + Time
        {
            type: 'box',
            layout: 'horizontal',
            alignItems: 'center',
            justifyContent: 'space-between',
            contents: [
                {
                    type: 'text',
                    text: config.label.toUpperCase(),
                    weight: 'bold',
                    color: config.color,
                    size: 'xs',
                    flex: 1
                },
                {
                    type: 'text',
                    text: `${dateStr} ${timeStr}`,
                    size: 'xs',
                    color: '#bbbbbb',
                    align: 'end',
                    flex: 0
                }
            ]
        },
        // Title: Event Name
        {
            type: 'text',
            text: eventName,
            weight: 'bold',
            size: 'xl',
            color: '#1a1a1a',
            margin: 'md',
            wrap: true
        }
    ];

    // Event Date & Time
    if (eventDate) {
        mainContents.push({
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            margin: 'sm',
            contents: [
                {
                    type: 'icon',
                    url: 'https://img.icons8.com/fluency/48/calendar.png',
                    size: 'xs',
                    aspectRatio: '1:1'
                },
                {
                    type: 'text',
                    text: eventDate,
                    size: 'xs',
                    color: '#888888',
                    flex: 1,
                    wrap: true
                }
            ]
        });
    }

    // Venue Row
    if (venue) {
        mainContents.push({
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            margin: 'sm',
            contents: [
                {
                    type: 'icon',
                    url: 'https://img.icons8.com/fluency/48/place-marker.png',
                    size: 'xs',
                    aspectRatio: '1:1'
                },
                {
                    type: 'text',
                    text: venue,
                    size: 'xs',
                    color: '#888888',
                    flex: 1,
                    wrap: true
                }
            ]
        });
    }

    // Separator
    mainContents.push({
        type: 'separator',
        margin: 'xl',
        color: '#f0f0f0'
    });

    // Progress Section
    if (validProgress !== undefined) {
        mainContents.push({
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
                {
                    type: 'box',
                    layout: 'horizontal',
                    justifyContent: 'space-between',
                    contents: [
                        { type: 'text', text: 'Progress', size: 'xs', color: '#aaaaaa', weight: 'bold' },
                        { type: 'text', text: `${validProgress}%`, size: 'xs', weight: 'bold', color: config.color }
                    ]
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    width: '100%',
                    backgroundColor: '#f5f5f5',
                    height: '6px',
                    cornerRadius: '3px',
                    margin: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            width: `${validProgress}%`,
                            backgroundColor: config.color,
                            height: '6px',
                            cornerRadius: '3px',
                            contents: []
                        }
                    ]
                }
            ]
        });
    }

    // Message Section
    if (message) {
        mainContents.push({
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            backgroundColor: '#f9f9f9',
            cornerRadius: 'md',
            paddingAll: 'md',
            contents: [
                {
                    type: 'text',
                    text: message,
                    size: 'sm',
                    color: '#555555',
                    wrap: true,
                    lineSpacing: '5px'
                }
            ]
        });
    }

    // Sender Name Footer
    if (senderName) {
        mainContents.push({
            type: 'box',
            layout: 'baseline',
            margin: 'xl',
            contents: [
                {
                    type: 'text',
                    text: `Updated by ${senderName}`,
                    size: 'xxs',
                    color: '#cccccc',
                    align: 'center'
                }
            ]
        });
    }

    // Use a vertical bar style design for professionalism
    const bubble: any = {
        type: 'bubble',
        size: 'mega',
        body: {
            type: 'box',
            layout: 'vertical',
            paddingAll: '0px',
            contents: [
                // 1. Color Bar at Top
                {
                    type: 'box',
                    layout: 'vertical',
                    height: '6px',
                    backgroundColor: config.barColor,
                    contents: []
                },
                // 2. Main Content Area
                {
                    type: 'box',
                    layout: 'vertical',
                    paddingAll: '20px',
                    contents: mainContents
                }
            ]
        }
    };

    return {
        type: 'flex',
        altText: `แจ้งเตือนสถานะ: ${config.label}`,
        contents: bubble
    };
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
    const flexMessage = createStatusFlexMessage(eventName, status, message);
    return pushMessage(lineUid, [flexMessage]);
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

/**
 * ส่งข้อความจากผู้ดูแล (Admin Message)
 * ออกแบบให้ดูเป็นทางการ (Professional Look)
 */
export async function sendAdminMessage(
    lineUid: string,
    subject: string,
    message: string,
    imageUrl?: string,
    actionUrl?: string,
    actionLabel: string = 'ดูรายละเอียด'
) {
    const bubble: any = {
        type: 'bubble',
        size: 'mega',
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                        {
                            type: 'text',
                            text: 'ADMIN MESSAGE',
                            weight: 'bold',
                            color: '#0A5C5A', // Primary Color
                            size: 'xs',
                            flex: 1
                        }
                    ],
                    marginBottom: 'md'
                },
                {
                    type: 'text',
                    text: subject,
                    weight: 'bold',
                    size: 'xl',
                    wrap: true,
                    color: '#1a1a1a'
                },
                {
                    type: 'separator',
                    margin: 'lg',
                    color: '#E5E7EB'
                },
                {
                    type: 'text',
                    text: message,
                    size: 'sm',
                    color: '#4B5563',
                    margin: 'lg',
                    wrap: true,
                    lineSpacing: '4px'
                }
            ]
        }
    };

    if (imageUrl) {
        bubble.hero = {
            type: 'image',
            url: imageUrl,
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
            action: actionUrl ? { type: 'uri', uri: actionUrl } : undefined
        };
    }

    if (actionUrl) {
        bubble.footer = {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
                {
                    type: 'button',
                    style: 'primary',
                    height: 'sm',
                    action: {
                        type: 'uri',
                        label: actionLabel,
                        uri: actionUrl
                    },
                    color: '#0A5C5A'
                }
            ],
            paddingAll: 'lg'
        };
    }

    return pushMessage(lineUid, [{
        type: 'flex',
        altText: `ข้อความจากผู้ดูแล: ${subject}`,
        contents: bubble
    }]);
}

