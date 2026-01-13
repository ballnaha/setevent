import { Metadata } from 'next';
import DesignsContent from './DesignsContent';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'New Designs | SET EVENT',
    description: 'ผลงานการออกแบบและจัดอีเวนต์ที่สวยงาม สร้างสรรค์โดยทีมงาน SET EVENT',
    keywords: ['งานแต่งงาน', 'อีเวนต์', 'ออกแบบเวที', 'Stage Design', 'Wedding Planner', 'Event Organizer']
};

export default async function DesignsPage() {
    // Fetch data on the server
    const designs = await prisma.design.findMany({
        where: { status: 'active' },
        orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
        ],
        select: {
            id: true,
            title: true,
            category: true,
            image: true,
            likes: true,
            views: true,
        }
    });

    const initialData = designs.map(d => ({
        ...d,
        image: d.image || '/images/placeholder.jpg'
    }));

    return <DesignsContent initialData={initialData} />;
}
