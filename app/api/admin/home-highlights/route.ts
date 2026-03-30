import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const SETTINGS_KEY = 'home_portfolio_highlights';

// Default data if none exists
const DEFAULT_HIGHLIGHTS = [
    {
        title: "งานแต่งงานหรู ณ โรงแรมแกรนด์",
        category: "Wedding LED Screen",
        mediaType: 'image',
        src: "/images/wedding.webp",
        link: "/portfolio/wedding-led-grand-hotel"
    },
    {
        title: "บรรยากาศงานอีเว้นท์ระดับพรีเมียม",
        category: "Event Atmosphere",
        mediaType: 'youtube',
        src: "vPF_635D_aA",
        link: "/portfolio"
    },
    {
        title: "สัมมนาผู้บริหารระดับประเทศ",
        category: "Corporate Seminar",
        mediaType: 'image',
        src: "/images/seminar.webp",
        link: "/portfolio/corporate-seminar-p3-led"
    },
    {
        title: "คอนเสิร์ตระเบิดความมันส์",
        category: "Concert Lighting & LED",
        mediaType: 'image',
        src: "/images/concert.webp",
        link: "/portfolio/concert-outdoor-led"
    }
];

export async function GET() {
    try {
        const setting = await prisma.sitesettings.findUnique({
            where: { key: SETTINGS_KEY }
        });

        if (!setting) {
            return NextResponse.json(DEFAULT_HIGHLIGHTS);
        }

        return NextResponse.json(JSON.parse(setting.value));
    } catch (error) {
        console.error("Error fetching homepage highlights:", error);
        return NextResponse.json({ error: "Failed to fetch highlights" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        
        // Basic validation: must be an array of 4 items
        if (!Array.isArray(data) || data.length !== 4) {
            return NextResponse.json({ error: "Invalid data format. Exactly 4 highlights required." }, { status: 400 });
        }

        const setting = await prisma.sitesettings.upsert({
            where: { key: SETTINGS_KEY },
            update: { value: JSON.stringify(data) },
            create: {
                key: SETTINGS_KEY,
                value: JSON.stringify(data)
            }
        });

        return NextResponse.json({ success: true, data: JSON.parse(setting.value) });
    } catch (error) {
        console.error("Error saving homepage highlights:", error);
        return NextResponse.json({ error: "Failed to save highlights" }, { status: 500 });
    }
}
