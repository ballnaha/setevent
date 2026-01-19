import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Happy Valentine's Day 💕 | ส่งความรักให้คนพิเศษ",
    description: "ส่งความรักและความสุขในวันวาเลนไทน์ ด้วยการ์ดอวยพรสุดพิเศษ ที่เต็มไปด้วยความทรงจำดีๆ",
    keywords: ["valentine", "valentines day", "love", "วาเลนไทน์", "ความรัก", "การ์ดอวยพร"],
    openGraph: {
        title: "Happy Valentine's Day 💕",
        description: "ส่งความรักและความสุขในวันวาเลนไทน์ ด้วยการ์ดอวยพรสุดพิเศษ",
        type: "website",
        locale: "th_TH",
        images: [
            {
                url: "/og-valentine.jpg", // ใส่ URL รูป OG Image ที่นี่
                width: 1200,
                height: 630,
                alt: "Happy Valentine's Day",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Happy Valentine's Day 💕",
        description: "ส่งความรักและความสุขในวันวาเลนไทน์",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ValentineLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
