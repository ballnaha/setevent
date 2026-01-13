import { Metadata } from 'next';
import FAQContent from './FAQContent';
import { FAQSchema } from '@/components/seo/JsonLdSchema';

export const metadata: Metadata = {
    title: 'คำถามที่พบบ่อย (FAQ) | SET EVENT Thailand',
    description: 'รวมคำตอบคำถามที่พบบ่อยเกี่ยวกับบริการเช่าจอ LED, เครื่องเสียง, เวที จาก SET EVENT Thailand - ราคา, การจอง, การติดตั้ง และอื่นๆ',
    keywords: [
        'FAQ SET EVENT',
        'คำถามที่พบบ่อย',
        'เช่าจอ LED ราคา',
        'บริการจัดงานอีเวนต์',
        'เช่าเครื่องเสียง',
        'งานแต่งงาน',
        'คอนเสิร์ต',
        'สัมมนา'
    ],
    openGraph: {
        title: 'คำถามที่พบบ่อย (FAQ) | SET EVENT Thailand',
        description: 'รวมคำตอบคำถามที่พบบ่อยเกี่ยวกับบริการจัดงานอีเวนต์จาก SET EVENT',
        url: 'https://seteventthailand.com/faq',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/faq',
    },
};

export default function FAQPage() {
    return (
        <>
            <FAQSchema />
            <FAQContent />
        </>
    );
}
