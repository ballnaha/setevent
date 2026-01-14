import { Metadata } from 'next';
import PrivacyPolicyContent from './PrivacyPolicyContent';

export const metadata: Metadata = {
    title: "นโยบายความเป็นส่วนตัว | SET EVENT Thailand",
    description: "นโยบายความเป็นส่วนตัว (Privacy Policy) และการคุ้มครองข้อมูลส่วนบุคคล (PDPA) ของ SET EVENT Thailand เพื่อให้ท่านมั่นใจในการใช้บริการของเรา",
    keywords: ['นโยบายความเป็นส่วนตัว', 'PDPA', 'ความเป็นส่วนตัว', 'SET EVENT', 'การคุ้มครองข้อมูล'],
    openGraph: {
        title: 'นโยบายความเป็นส่วนตัว | SET EVENT Thailand',
        description: 'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของ SET EVENT Thailand',
        url: 'https://seteventthailand.com/privacy-policy',
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
    },
    alternates: {
        canonical: 'https://seteventthailand.com/privacy-policy',
    },
};

export default function PrivacyPolicyPage() {
    return <PrivacyPolicyContent />;
}
