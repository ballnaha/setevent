import { Metadata } from 'next';
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
    title: "ติดต่อเรา | SET EVENT Thailand",
    description: "ติดต่อทีมงาน SET EVENT Thailand สำหรับบริการเช่าจอ LED เครื่องเสียง เวที แสง สี สำหรับงานอีเวนต์ งานแต่งงาน คอนเสิร์ต และงานสัมมนา โทร: 093-726-5055",
    keywords: ['ติดต่อ SET EVENT', 'เช่าจอ LED', 'เช่าเครื่องเสียง', 'จัดงานอีเวนต์', 'งานแต่งงาน', 'คอนเสิร์ต'],
    openGraph: {
        title: 'ติดต่อเรา | SET EVENT Thailand',
        description: 'ติดต่อ SET EVENT Thailand สำหรับบริการจัดงานอีเวนต์ครบวงจร',
        url: 'https://seteventthailand.com/contact',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/contact',
    },
};

export default function ContactPage() {
    return <ContactContent />;
}
