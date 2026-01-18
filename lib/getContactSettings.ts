import prisma from '@/lib/prisma';

export interface ContactSettings {
    address: string;
    phone: string;
    email: string;
    line: string;
    lineUrl: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    mapUrl: string;
}

const DEFAULT_CONTACT: ContactSettings = {
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

// Server-side function to get contact settings (no API call needed)
export async function getContactSettings(): Promise<ContactSettings> {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { key: "contact" }
        });

        if (!settings) {
            return DEFAULT_CONTACT;
        }

        return JSON.parse(settings.value) as ContactSettings;
    } catch (error) {
        console.error("Error fetching contact settings:", error);
        return DEFAULT_CONTACT;
    }
}
