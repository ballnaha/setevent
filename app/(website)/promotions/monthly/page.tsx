import { Metadata } from 'next';
import MonthlyPromotionContent from './MonthlyPromotionContent';

export const metadata: Metadata = {
    title: "โปรโมชั่นประจำเดือน - เช่าจอ LED ราคาถูก และแพ็คเกจอีเว้นท์คุ้มที่สุด | SetEvent",
    description: "รวมความคุ้มค่ากับโปรโมชั่นประจำเดือนจาก SetEvent เช่าจอ LED Screen ราคาพิเศษ แพ็คเกจงานแต่งงาน และอีเว้นท์ครบวงจร ในราคาประหยัด คลุมงบประมาณได้ชัวร์",
    keywords: [
        "โปรโมชั่นเช่าจอ LED",
        "เช่าจอ LED ราคาถูก",
        "แพ็คเกจงานแต่งงาน",
        "เช่าจอ LED รายเดือน",
        "ราคาเช่าจอ LED",
        "SetEvent Promotion"
    ],
    openGraph: {
        title: "โปรโมชั่นประจำเดือน - SetEvent",
        description: "โปรโมชั่นเช่าจอ LED และแพ็คเกจจัดงานอีเว้นท์สุดคุ้มประจำเดือน",
        images: ['/images/og-image.jpg'],
    }
};

export default function MonthlyPromotionPage() {
    return <MonthlyPromotionContent />;
}
