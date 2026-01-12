import { NextResponse } from "next/server";
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

// GET - Get contact settings (reuse from /api/settings/contact)
export async function GET() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { key: "contact" }
        });

        if (!settings) {
            return NextResponse.json(DEFAULT_CONTACT);
        }

        return NextResponse.json(JSON.parse(settings.value));
    } catch (error) {
        console.error("Error fetching contact settings:", error);
        return NextResponse.json(DEFAULT_CONTACT);
    }
}
