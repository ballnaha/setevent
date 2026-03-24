import { Metadata } from 'next';
import WeddingECardContent from './WeddingECardContent';

export const revalidate = 0;

export const metadata: Metadata = {
    title: 'Wedding E-Card | SET EVENT',
    description: 'การ์ดงานแต่งงานออนไลน์ สวยงาม ใช้งานง่าย พร้อมระบบนับถอยหลังและแผนที่ RSVP แกลเลอรี่ภาพ พรีเวดดิ้ง Maps ราคาเริ่มต้น 3,500 บาท',
    keywords: ['การ์ดงานแต่งงานออนไลน์', 'Wedding E-Card', 'การ์ดแต่งงาน', 'Digital Wedding Invitation', 'Online Wedding Card', 'e card แต่งงาน', 'เช่าการ์ดงานแต่ง'],
    openGraph: {
        title: 'Wedding E-Card งานแต่งงานออนไลน์ | SET EVENT',
        description: 'การ์ดเชิญงานแต่งออนไลน์ ครบฟังก์ชัน Countdown RSVP Maps แกลเลอรี่ ราคา 3,500 บาท สร้างวันแต่งงานที่น่าประทับใจ',
        url: 'https://seteventthailand.com/wedding-e-card',
        images: [
            {
                url: 'https://seteventthailand.com/images/logo_black1.png',
                width: 1200,
                height: 630,
                alt: 'Wedding E-Card การ์ดงานแต่งงานออนไลน์'
            },
            {
                url: 'https://seteventthailand.com/images/e-card.mp4',
                width: 1200,
                height: 630,
            }
        ],
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Wedding E-Card | SET EVENT',
        description: 'การ์ดงานแต่งงานออนไลน์ ครบฟังก์ชัน ราคาถูก คุณภาพมืออาชีพ พร้อมระบบนับถอยหลัง RSVP แผนที่ Google Maps แกลเลอรี่ภาพ พรีเวดดิ้ง',
        images: ['https://seteventthailand.com/images/logo_black1.png'],
    },
    alternates: {
        canonical: 'https://seteventthailand.com/wedding-e-card',
    },
    robots: {
        index: true,
        follow: true,
    },
};

import { WeddingECardSchema } from './WeddingECardSchema';

export default async function WeddingECardPage() {
    return (
        <>
            <WeddingECardSchema />
            <WeddingECardContent />
        </>
    );
}
