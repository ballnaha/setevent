import { Metadata } from 'next';
import TermsOfServiceContent from './TermsOfServiceContent';

export const metadata: Metadata = {
    title: "เงื่อนไขการใช้บริการ | SET EVENT Thailand",
    description: "เงื่อนไขการใช้บริการ (Terms of Service) ของ SET EVENT Thailand - ข้อตกลงและเงื่อนไขในการใช้บริการเช่าจอ LED เครื่องเสียง และบริการจัดงานอีเวนต์",
    keywords: ['เงื่อนไขการใช้บริการ', 'Terms of Service', 'ข้อตกลง', 'SET EVENT', 'เช่าจอ LED', 'จัดงานอีเวนต์'],
    openGraph: {
        title: 'เงื่อนไขการใช้บริการ | SET EVENT Thailand',
        description: 'เงื่อนไขการใช้บริการและข้อตกลงในการใช้บริการของ SET EVENT Thailand',
        url: 'https://seteventthailand.com/terms-of-service',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/terms-of-service',
    },
};

export default function TermsOfServicePage() {
    return <TermsOfServiceContent />;
}
