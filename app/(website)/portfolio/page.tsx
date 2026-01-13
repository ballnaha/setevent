import { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = {
    title: 'ผลงาน Portfolio | SET EVENT Thailand',
    description: 'ชมผลงานที่ผ่านมาของ SET EVENT Thailand - งาน Marketing Event, Seminar, นิทรรศการ, คอนเสิร์ต, งานแต่งงาน และ Fixed Installation ด้วยทีมงานมืออาชีพ',
    keywords: [
        'Portfolio SET EVENT',
        'ผลงานจัดอีเวนต์',
        'งาน Marketing Event',
        'คอนเสิร์ต',
        'งานแต่งงาน',
        'สัมมนา',
        'นิทรรศการ',
        'Fixed Installation'
    ],
    openGraph: {
        title: 'ผลงาน Portfolio | SET EVENT Thailand',
        description: 'ชมผลงานจัดงานอีเวนต์ที่ผ่านมาของ SET EVENT Thailand',
        url: 'https://seteventthailand.com/portfolio',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/portfolio',
    },
};

export default function PortfolioPage() {
    return <PortfolioContent />;
}
