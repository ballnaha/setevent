import { Metadata } from 'next';
import FAQContent from './FAQContent';
import { FAQSchema } from '@/components/seo/JsonLdSchema';

export const metadata: Metadata = {
    title: 'คำถามที่พบบ่อย (FAQ) | SET EVENT Thailand',
    description: 'รวมคำตอบคำถามที่พบบ่อยเกี่ยวกับบริการเช่าจอ LED ใกล้ฉัน, เครื่องเสียง, เวที จาก SET EVENT Thailand - ราคา, การจอง, การติดตั้ง และอื่นๆ',
    keywords: [
        'เช่าจอ LED ใกล้ฉัน',
        'FAQ SET EVENT',
        'คำถามที่พบบ่อย',
        'เช่าจอ LED ราคา',
        'บริการจัดงานอีเว้นท์',
        'เช่าเครื่องเสียง',
        'งานแต่งงาน',
        'คอนเสิร์ต',
        'สัมมนา'
    ],
    openGraph: {
        title: 'คำถามที่พบบ่อย (FAQ) | SET EVENT Thailand',
        description: 'รวมคำตอบคำถามที่พบบ่อยเกี่ยวกับบริการจัดงานอีเว้นท์จาก SET EVENT',
        url: 'https://seteventthailand.com/faq',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/faq',
    },
};

import prisma from '@/lib/prisma';

async function getFaqs() {
    try {
        return await prisma.faq.findMany({
            where: { status: 'active' },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                question: true,
                answer: true,
                category: true
            }
        });
    } catch (error) {
        console.error("Error fetching FAQs for page:", error);
        return [];
    }
}

export default async function FAQPage() {
    const faqs = await getFaqs();
    
    return (
        <>
            <FAQSchema faqs={faqs} />
            <FAQContent initialFaqs={faqs} />
        </>
    );
}
