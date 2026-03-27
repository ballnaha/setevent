import { Metadata } from 'next';
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
    title: "เกี่ยวกับเรา | SET EVENT Thailand",
    description: "ทำความรู้จักกับ SET EVENT Thailand ผู้นำบริการให้เช่าจอ LED และอุปกรณ์อีเว้นท์ครบวงจร ด้วยประสบการณ์กว่า 10 ปี มั่นใจในคุณภาพและทีมงานมืออาชีพ",
    keywords: ['เกี่ยวกับ SET EVENT', 'ทีมงาน SET EVENT', 'เช่าจอ LED', 'จัดงานอีเว้นท์', 'ประวัติบริษัท'],
    openGraph: {
        title: 'เกี่ยวกับเรา | SET EVENT Thailand',
        description: 'ทำความรู้จักกับ SET EVENT Thailand ผู้นำบริการจัดงานอีเว้นท์ครบวงจร',
        url: 'https://seteventthailand.com/about',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/about',
    },
};

export default function AboutPage() {
    return <AboutContent />;
}
