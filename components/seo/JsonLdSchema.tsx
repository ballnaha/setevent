'use client';

import Script from 'next/script';

interface OrganizationSchemaProps {
    name?: string;
    url?: string;
    logo?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: {
        streetAddress?: string;
        addressLocality?: string;
        addressRegion?: string;
        postalCode?: string;
        addressCountry?: string;
    };
    socialProfiles?: string[];
}

export function OrganizationSchema({
    name = 'SET Event Thailand',
    url = 'https://seteventthailand.com',
    logo = 'https://seteventthailand.com/logo.png',
    description = 'SET Event Thailand - บริการให้เช่าจอ LED, เวที, แสงสี เสียง และอุปกรณ์งานอีเวนต์ครบวงจร สำหรับงานคอนเสิร์ต งานแต่งงาน งานสัมมนา และงานอีเวนต์ทุกประเภท',
    phone = '+66-93-726-5055',
    email = 'setevent26@gmail.com',
    address = {
        streetAddress: 'Bangkok',
        addressLocality: 'Bangkok',
        addressRegion: 'Bangkok',
        postalCode: '10000',
        addressCountry: 'TH',
    },
    socialProfiles = [
        'https://www.facebook.com/setevent',
        'https://www.instagram.com/setevent',
        'https://line.me/ti/p/~@setevent',
    ],
}: OrganizationSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        logo,
        description,
        telephone: phone,
        email,
        address: {
            '@type': 'PostalAddress',
            ...address,
        },
        sameAs: socialProfiles,
    };

    return (
        <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface LocalBusinessSchemaProps {
    name?: string;
    description?: string;
    url?: string;
    image?: string;
    priceRange?: string;
    openingHours?: string[];
}

export function LocalBusinessSchema({
    name = 'SET Event Thailand',
    description = 'บริการให้เช่าจอ LED และอุปกรณ์งานอีเวนต์ครบวงจร ด้วยทีมงานมืออาชีพ',
    url = 'https://seteventthailand.com',
    image = 'https://seteventthailand.com/logo.png',
    priceRange = '฿฿฿',
    openingHours = ['Mo-Fr 09:00-18:00', 'Sa 09:00-18:00', 'Su 09:00-18:00'],
}: LocalBusinessSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': url,
        name,
        description,
        url,
        image,
        priceRange,
        openingHoursSpecification: openingHours.map((hours) => {
            const [days, time] = hours.split(' ');
            const [opens, closes] = time.split('-');
            return {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: days.split('-').map((d) => {
                    const dayMap: { [key: string]: string } = {
                        Mo: 'Monday',
                        Tu: 'Tuesday',
                        We: 'Wednesday',
                        Th: 'Thursday',
                        Fr: 'Friday',
                        Sa: 'Saturday',
                        Su: 'Sunday',
                    };
                    return dayMap[d] || d;
                }),
                opens,
                closes,
            };
        }),
    };

    return (
        <Script
            id="local-business-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface ServiceSchemaProps {
    services?: Array<{
        name: string;
        description: string;
        url?: string;
    }>;
}

export function ServiceSchema({
    services = [
        {
            name: 'เช่าจอ LED',
            description: 'บริการให้เช่าจอ LED ทุกขนาด ทั้ง Indoor และ Outdoor สำหรับงานคอนเสิร์ต งานสัมมนา งานแต่งงาน และอีเวนต์ทุกประเภท',
            url: 'https://seteventthailand.com/products/rental/led-screen',
        },
        {
            name: 'เช่าเครื่องเสียง',
            description: 'บริการให้เช่าเครื่องเสียง ระบบ PA ไมโครโฟน และอุปกรณ์เสียงครบครัน',
            url: 'https://seteventthailand.com/products/rental/sound',
        },
        {
            name: 'เช่าไฟเวที',
            description: 'บริการให้เช่าไฟเวที ไฟ Moving Head ไฟ Par และระบบแสงสีครบวงจร',
            url: 'https://seteventthailand.com/products/rental/lighting',
        },
        {
            name: 'เช่าเวที',
            description: 'บริการให้เช่าเวทีและโครงสร้าง Truss สำหรับงานอีเวนต์ทุกขนาด',
            url: 'https://seteventthailand.com/products/rental/stage',
        },
        {
            name: 'จัดดอกไม้ และ ของชำร่วย',
            description: 'บริการจัดดอกไม้ และ ของชำร่วยสำหรับงานอีเวนต์ทุกประเภท',
            url: 'https://seteventthailand.com/products/rental/flower-souvenirs',
        }
    ],
}: ServiceSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Service',
                name: service.name,
                description: service.description,
                url: service.url,
                provider: {
                    '@type': 'Organization',
                    name: 'SET Event Thailand',
                },
            },
        })),
    };

    return (
        <Script
            id="service-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface FAQSchemaProps {
    faqs?: Array<{
        question: string;
        answer: string;
    }>;
}

export function FAQSchema({
    faqs = [
        {
            question: 'SET Event ให้บริการอะไรบ้าง?',
            answer: 'SET Event ให้บริการเช่าจอ LED, เครื่องเสียง, ไฟเวที, เวทีและโครงสร้าง รวมถึงบริการติดตั้ง Motion Graphic, Interactive และ Laser Show สำหรับงานอีเวนต์ทุกประเภท',
        },
        {
            question: 'สามารถเช่าจอ LED ได้ขนาดเท่าไหร่?',
            answer: 'เรามีจอ LED ให้เลือกหลายขนาด ตั้งแต่ P2.6, P3.9, P4.8 จนถึง P10 ทั้ง Indoor และ Outdoor สามารถปรับขนาดได้ตามความต้องการ',
        },
        {
            question: 'บริการครอบคลุมพื้นที่ไหนบ้าง?',
            answer: 'เราให้บริการทั่วประเทศไทย ทั้งกรุงเทพฯ ปริมณฑล และต่างจังหวัด พร้อมทีมงานติดตั้งมืออาชีพ',
        },
        {
            question: 'มีบริการ Technical Support หรือไม่?',
            answer: 'มีครับ เรามีทีม Technical Support ดูแลตลอดงาน พร้อมช่างเทคนิคมืออาชีพ',
        },
        {
            question: 'ต้องจองล่วงหน้านานแค่ไหน?',
            answer: 'แนะนำให้จองล่วงหน้าอย่างน้อย 1-2 สัปดาห์ แต่สำหรับงานใหญ่ควรจองล่วงหน้า 1 เดือนขึ้นไป',
        },
    ],
}: FAQSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <Script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Combined Schema for homepage
export function HomepageSchema() {
    return (
        <>
            <OrganizationSchema />
            <LocalBusinessSchema />
            <ServiceSchema />
        </>
    );
}
