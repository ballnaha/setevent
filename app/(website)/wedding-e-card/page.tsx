import { Metadata } from 'next';
import WeddingECardContent from './WeddingECardContent';

export const revalidate = 0;

export const metadata: Metadata = {
    title: 'Wedding E-Card | SET EVENT',
    description: 'การ์ดงานแต่งงานออนไลน์ สวยงาม ใช้งานง่าย พร้อมระบบนับถอยหลังและแผนที่',
    keywords: ['การ์ดงานแต่งงานออนไลน์', 'Wedding E-Card', 'การ์ดแต่งงาน', 'Digital Wedding Invitation', 'Online Wedding Card']
};

export default async function WeddingECardPage() {
    return (
        <WeddingECardContent />
    );
}
