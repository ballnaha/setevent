import { Metadata } from 'next';
import AuspiciousDatesContent from './AuspiciousDatesContent';
import { AuspiciousDatesSchema } from './AuspiciousDatesSchema';

export async function generateMetadata(): Promise<Metadata> {
    const currentYear = new Date().getFullYear();
    const currentThaiYear = currentYear + 543;

    return {
        title: 'หาฤกษ์มงคลสมรส ฤกษ์แต่งงาน | SET EVENT Thailand',
        description: 'ปรึกษาและหาฤกษ์มงคลสมรส ฤกษ์แต่งงานที่แม่นยำที่สุด คำนวณตามดวงชะตาเฉพาะบุคคล โดยผู้เชี่ยวชาญจาก SET EVENT พร้อมปฏิทินวันดีฤกษ์งามยามดีสำหรับการเริ่มต้นชีวิตคู่',
        keywords: [
            'ฤกษ์แต่งงาน',
            'หาฤกษ์แต่งงาน',
            'ฤกษ์มงคลสมรส',
            'บริการหาฤกษ์แต่งงาน',
            'วันดีแต่งงาน',
            `ฤกษ์แต่งงานปี ${currentThaiYear}`,
            `ฤกษ์แต่งงานปี ${currentThaiYear + 1}`,
            `ฤกษ์แต่งงานปี ${currentThaiYear + 2}`,
            'ปฏิทินฤกษ์แต่งงาน',
            'หาฤกษ์ดีวิวาห์',
            'ฤกษ์จดทะเบียนสมรส'
        ],
        openGraph: {
            title: 'หาฤกษ์มงคลสมรส ฤกษ์แต่งงาน | SET EVENT Thailand',
            description: 'หาฤกษ์มงคลสมรส ฤกษ์แต่งงานที่เหมาะสมที่สุดสำหรับคุณ วิเคราะห์ตามหลักโหราศาสตร์อย่างแม่นยำ เริ่มต้นชีวิตคู่ด้วยความเป็นสิริมงคล',
            url: 'https://seteventthailand.com/auspicious-dates',
            siteName: 'SET EVENT Thailand',
            locale: 'th_TH',
            type: 'website',
            images: [
                {
                    url: 'https://seteventthailand.com/images/logo_black1.png', // Assuming base logo exists, replace if custom hero image exists
                    width: 1200,
                    height: 630,
                    alt: 'หาฤกษ์แต่งงาน ฤกษ์มงคลสมรส SET EVENT'
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'หาฤกษ์มงคลสมรส ฤกษ์แต่งงาน | SET EVENT Thailand',
            description: 'หาฤกษ์มงคลสมรสและฤกษ์แต่งงานที่ดีที่สุด พร้อมวิเคราะห์ดวงคู่บ่าวสาว เริ่มต้นชีวิตคู่ด้วยความสิริมงคล ปรึกษาฟรี',
            images: ['https://seteventthailand.com/images/logo_black1.png'],
        },
        alternates: {
            canonical: 'https://seteventthailand.com/auspicious-dates',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function AuspiciousDatesPage() {
    return (
        <>
            <AuspiciousDatesSchema />
            <AuspiciousDatesContent />
        </>
    );
}
