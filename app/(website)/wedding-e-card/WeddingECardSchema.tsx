import Script from 'next/script';

export function WeddingECardSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Wedding E-Card Online',
        provider: {
            '@type': 'Organization',
            name: 'SET Event Thailand',
            url: 'https://seteventthailand.com',
            telephone: '+66-93-726-5055',
            email: 'setevent26@gmail.com'
        },
        areaServed: 'Thailand',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Wedding E-Card Packages',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Professional Online Wedding Card',
                        description: 'การ์ดเชิญงานแต่งงานออนไลน์ ครบฟังก์ชัน Countdown, RSVP, Maps, Gallery',
                    },
                    priceSpecification: {
                        '@type': 'PriceSpecification',
                        price: '3500',
                        priceCurrency: 'THB',
                        description: 'ราคาเริ่มต้น 3,500 บาท'
                    }
                }
            ]
        },
        description: 'บริการสร้างการ์ดงานแต่งงานออนไลน์ สวยงาม ใช้งานง่าย รองรับมือถือ ระบบ RSVP นับถอยหลัง แผนที่ Google Maps แกลเลอรี่ภาพ',
        url: 'https://seteventthailand.com/wedding-e-card'
    };

    return (
        <Script
            id="wedding-ecard-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}