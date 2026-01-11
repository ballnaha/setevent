import { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = {
    title: 'Portfolio | SET EVENT',
    description: 'ผลงานที่ผ่านมาของ SET EVENT - Marketing Event, Seminar, Exhibition, Concert, Wedding และ Fixed Installation',
    keywords: ['Portfolio', 'ผลงาน', 'Event', 'อีเวนต์', 'งานแต่งงาน', 'คอนเสิร์ต', 'สัมมนา', 'นิทรรศการ']
};

export default function PortfolioPage() {
    return <PortfolioContent />;
}
