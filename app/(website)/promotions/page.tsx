import { Metadata } from 'next';
import PromotionsContent from './PromotionsContent';

export const metadata: Metadata = {
    title: 'โปรโมชั่นพิเศษ | SET EVENT Thailand',
    description: 'รวมโปรโมชั่นและดีลพิเศษสุดคุ้มสำหรับบริการเช่าจอ LED เครื่องเสียง เวที และอุปกรณ์งานอีเวนต์ครบวงจรจาก SET EVENT Thailand',
    keywords: [
        'โปรโมชั่น SET EVENT',
        'ส่วนลดเช่าจอ LED',
        'ดีลพิเศษงานอีเวนต์',
        'โปรโมชั่นงานแต่งงาน',
        'แพ็คเกจงานอีเวนต์'
    ],
    openGraph: {
        title: 'โปรโมชั่นพิเศษ | SET EVENT Thailand',
        description: 'รวมโปรโมชั่นและดีลพิเศษสุดคุ้มสำหรับบริการจัดงานอีเวนต์',
        url: 'https://seteventthailand.com/promotions',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/promotions',
    },
};

export default function PromotionsPage() {
    return <PromotionsContent />;
}
