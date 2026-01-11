import { Metadata } from 'next';
import PromotionsContent from './PromotionsContent';

export const metadata: Metadata = {
    title: 'Promotions | SET EVENT',
    description: 'รวมโปรโมชั่นและดีลพิเศษสุดคุ้ม สำหรับบริการจัดงานอีเวนต์ เช่าอุปกรณ์ และอื่นๆ จาก SET EVENT',
    keywords: ['โปรโมชั่น', 'ส่วนลด', 'อีเวนต์', 'เช่าจอ LED', 'โครงสร้างเวที', 'SET EVENT']
};

export default function PromotionsPage() {
    return <PromotionsContent />;
}
