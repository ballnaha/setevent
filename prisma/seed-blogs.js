
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const blogs = [
    {
        title: "5 เทคนิคเลือกจอ LED ให้เหมาะกับงานอีเวนต์ของคุณ",
        slug: "5-tips-choose-led-screen",
        excerpt: "จอ LED มีหลายประเภท (P1.8, P2.5, P3.9) เลือกยังไงให้คุ้มค่าและภาพสวยคมชัดที่สุด? บทความนี้มีคำตอบสำหรับผู้จัดงานมือใหม่และมือโปร",
        content: "<p>การเลือกจอ LED ให้เหมาะสมกับงานอีเวนต์เป็นเรื่องสำคัญมาก...</p><h2>1. ระยะการมองเห็น (Viewing Distance)</h2><p>ถ้าเป็นงาน Indoor ที่คนดูอยู่ใกล้จอ ควรเลือก P2 หรือ P2.5...</p>",
        coverImage: "/images/concert.webp",
        category: "Knowledge",
        author: "SetEvent Team",
        views: 1250,
        status: "published"
    },
    {
        title: "ไอเดียจัดงานแต่งงานในสวน บรรยากาศอบอุ่น ปี 2026",
        slug: "garden-wedding-ideas-2026",
        excerpt: "รวมไอเดียจัดสถานที่ แสง สี และการตกแต่งงานแต่งงานในสวน (Garden Wedding) ให้โรแมนติกและน่าประทับใจ พร้อมเทคนิคการเลือกไฟประดับ",
        content: "<p>งานแต่งงานในสวนกำลังเป็นที่นิยมอย่างมาก...</p>",
        coverImage: "/images/wedding.webp",
        category: "Inspiration",
        author: "SetEvent Wedding",
        views: 3400,
        status: "published"
    },
    {
        title: "ระบบเสียงสำหรับงานสัมมนา เลือกยังไงไม่ให้ไมค์หอน",
        slug: "sound-system-seminar-guide",
        excerpt: "ปัญหาไมค์หอน เสียงก้อง ฟังไม่รู้เรื่อง แก้ง่ายๆ ด้วยการเลือกระบบเสียงที่ถูกต้องและการวางลำโพงที่ถูกตำแหน่ง",
        content: "<p>ในงานสัมมนา เนื้อหาคือหัวใจสำคัญ แต่ถ้าระบบเสียงไม่ดี...</p>",
        coverImage: "/images/seminar.webp",
        category: "Technical Guide",
        author: "Sound Engineer",
        views: 890,
        status: "published"
    },
    {
        title: "Mapping & Interactive: เทรนด์ใหม่ของการเปิดตัวสินค้า",
        slug: "mapping-interactive-product-launch",
        excerpt: "สร้างความตื่นตาตื่นใจให้กับการเปิดตัวสินค้า (Product Launch) ด้วยเทคนิค 3D Mapping และ Interactive Wall ที่จะทำให้แบรนด์ของคุณดูทันสมัยและน่าจดจำ",
        content: "<p>การเปิดตัวสินค้าในยุคนี้ แค่พรีเซนเทชั่นธรรมดาอาจไม่พอ...</p>",
        coverImage: "/images/launch.webp",
        category: "Trends",
        author: "Creative Director",
        views: 2100,
        status: "published"
    },
    {
        title: "ของชำร่วยงานอีเวนต์: เลือกร้านไหนดี ให้แขกประทับใจ",
        slug: "best-event-souvenirs",
        excerpt: "แนะนำไอเดียของชำร่วย (Souvenirs) ที่ใช้งานได้จริง ดีไซน์สวย และแสดงถึงเอกลักษณ์ของงาน พร้อมแนะนำร้านของชำร่วยคุณภาพ",
        content: "<p>ของชำร่วยคือสิ่งที่แขกจะนำกลับไปและระลึกถึงงานของคุณ...</p>",
        coverImage: "/images/gift.webp",
        category: "Guides",
        author: "SetEvent Team",
        views: 1500,
        status: "published"
    },
    {
        title: "After Party สุดมันส์: แสงสีเสียงต้องจัดเต็มแค่ไหน?",
        slug: "after-party-light-sound-setup",
        excerpt: "เปลี่ยนงานเลี้ยงทางการให้กลายเป็นปาร์ตี้สุดเหวี่ยง ด้วยการปรับเปลี่ยนระบบไฟ (Lighting) และเสียงดนตรี เตรียมตัวให้พร้อมสำหรับช่วงเวลาแห่งความสนุก",
        content: "<p>ช่วง After Party คือไฮไลท์ที่ทุกคนรอคอย...</p>",
        coverImage: "/images/party.webp",
        category: "Inspiration",
        author: "Party Planner",
        views: 4200,
        status: "published"
    }
];

async function main() {
    console.log(`Start seeding Blogs...`);

    // Try to clean up existing blogs (optional)
    try {
        await prisma.blog.deleteMany({});
        console.log(`Deleted existing Blogs.`);
    } catch (error) {
        console.log("No existing table or connection issue, skipping delete.");
    }


    for (const blog of blogs) {
        const createdBlog = await prisma.blog.create({
            data: blog,
        });
        console.log(`Created Blog: ${createdBlog.title}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
