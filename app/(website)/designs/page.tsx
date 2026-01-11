import { Metadata } from 'next';
import DesignsContent from './DesignsContent';

export const metadata: Metadata = {
    title: 'New Designs | SET EVENT',
    description: 'ผลงานการออกแบบและจัดอีเวนต์ที่สวยงาม สร้างสรรค์โดยทีมงาน SET EVENT',
    keywords: ['งานแต่งงาน', 'อีเวนต์', 'ออกแบบเวที', 'Stage Design', 'Wedding Planner', 'Event Organizer']
};

export default function DesignsPage() {
    return <DesignsContent />;
}
