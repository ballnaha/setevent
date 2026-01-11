import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Default contact settings
const DEFAULT_CONTACT = {
    address: "123/45 ถนนนวมินทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กทม. 10240",
    phone: "081-234-5678",
    email: "contact@seteventthailand.com",
    line: "@setevent",
    lineUrl: "https://line.me/ti/p/~@setevent",
    facebook: "",
    instagram: "",
    tiktok: "",
    mapUrl: ""
};

// GET - Get contact settings
export async function GET() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { key: "contact" }
        });

        if (!settings) {
            // Return default settings if not found
            return NextResponse.json(DEFAULT_CONTACT);
        }

        return NextResponse.json(JSON.parse(settings.value));
    } catch (error) {
        console.error("Error fetching contact settings:", error);
        return NextResponse.json(DEFAULT_CONTACT);
    }
}

// PUT - Update contact settings
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const settings = await prisma.siteSettings.upsert({
            where: { key: "contact" },
            update: {
                value: JSON.stringify(body)
            },
            create: {
                key: "contact",
                value: JSON.stringify(body)
            }
        });

        return NextResponse.json(JSON.parse(settings.value));
    } catch (error) {
        console.error("Error updating contact settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
