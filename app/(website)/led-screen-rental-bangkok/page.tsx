import { Metadata } from 'next';
import Image from 'next/image';
import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import { RECOMMENDED_SEO_KEYWORDS } from '@/lib/seo';

export const revalidate = 0;

const baseUrl = 'https://seteventthailand.com';
const pageUrl = `${baseUrl}/led-screen-rental-bangkok`;

export const metadata: Metadata = {
    title: 'เช่าจอ LED กรุงเทพ พร้อมติดตั้ง | SET EVENT Thailand',
    description: 'บริการเช่าจอ LED กรุงเทพและปริมณฑล สำหรับงานแต่ง งานสัมมนา งานเปิดตัวสินค้า และอีเว้นท์ครบวงจร พร้อมทีมติดตั้งมืออาชีพ ขอใบเสนอราคาได้ทันที',
    keywords: [
        'เช่าจอ LED กรุงเทพ',
        'เช่าจอ LED งานแต่ง กรุงเทพ',
        'เช่าจอ LED งานสัมมนา กรุงเทพ',
        'เช่าจอ LED พร้อมติดตั้ง',
        'เช่า led wall กรุงเทพ',
        'เช่า led screen กรุงเทพ',
        'จอ LED งานอีเว้นท์ กรุงเทพ',
        'จอ LED งานเปิดตัวสินค้า',
        'เช่าจอ LED ใกล้ฉัน',
        ...RECOMMENDED_SEO_KEYWORDS
    ],
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
        title: 'เช่าจอ LED กรุงเทพ พร้อมทีมติดตั้ง | SET EVENT Thailand',
        description: 'เช่าจอ LED สำหรับงานแต่ง งานสัมมนา งานเปิดตัวสินค้า และอีเว้นท์ในกรุงเทพ พร้อมระบบภาพ แสง เสียง และทีมงานดูแลหน้างาน',
        url: pageUrl,
        siteName: 'SET EVENT Thailand',
        locale: 'th_TH',
        type: 'website',
        images: [
            {
                url: `${baseUrl}/images/banner_event.png`,
                width: 1200,
                height: 630,
                alt: 'เช่าจอ LED กรุงเทพ SET EVENT Thailand',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'เช่าจอ LED กรุงเทพ | SET EVENT Thailand',
        description: 'บริการเช่าจอ LED พร้อมติดตั้งสำหรับงานอีเว้นท์ งานแต่ง และงานสัมมนาในกรุงเทพ',
        images: [`${baseUrl}/images/banner_event.png`],
    },
    robots: {
        index: true,
        follow: true,
    },
};

const useCases = [
    {
        title: 'งานแต่งงาน',
        text: 'แสดงภาพพรีเวดดิ้ง วิดีโอ Presentation ถ่ายทอดสดพิธี และ backdrop บนจอ LED ให้บรรยากาศดูพรีเมียมขึ้น'
    },
    {
        title: 'งานสัมมนาและประชุมบริษัท',
        text: 'รองรับสไลด์ วิทยากร ระบบภาพสำหรับห้องประชุม โรงแรม และงานองค์กรที่ต้องการภาพคมชัด'
    },
    {
        title: 'งานเปิดตัวสินค้า',
        text: 'สร้างจุดสนใจให้เวทีด้วย LED wall, key visual, motion graphic และระบบภาพที่เข้ากับแสงเสียง'
    }
];

const serviceAreas = [
    'กรุงเทพมหานคร',
    'นนทบุรี',
    'ปทุมธานี',
    'สมุทรปราการ',
    'นครปฐม',
    'ชลบุรี'
];

const faqs = [
    {
        question: 'เช่าจอ LED กรุงเทพ ราคาเริ่มต้นเท่าไหร่?',
        answer: 'ราคาขึ้นอยู่กับขนาดจอ ระยะเวลาติดตั้ง สถานที่จัดงาน และอุปกรณ์เสริม เช่น ระบบเสียง แสง เวที หรือทีมควบคุมหน้างาน สามารถส่งรายละเอียดงานเพื่อให้ทีม SET EVENT ประเมินราคาได้'
    },
    {
        question: 'ควรเลือกจอ LED ขนาดไหนสำหรับงานแต่งหรืองานสัมมนา?',
        answer: 'ขนาดจอควรดูจากจำนวนผู้ชม ระยะห่างจากเวที และรูปแบบคอนเทนต์ เช่น สไลด์ วิดีโอ หรือถ่ายทอดสด ทีมงานสามารถช่วยคำนวณสเปกที่เหมาะกับหน้างานจริงได้'
    },
    {
        question: 'SET EVENT มีทีมติดตั้งและดูแลระหว่างงานไหม?',
        answer: 'มีทีมติดตั้งและทีมเทคนิคดูแลระบบภาพตลอดงาน สามารถประสานร่วมกับทีมสถานที่ ออร์แกไนเซอร์ หรือทีมโปรดักชันของลูกค้าได้'
    },
    {
        question: 'ให้บริการนอกกรุงเทพหรือไม่?',
        answer: 'ให้บริการทั้งกรุงเทพ ปริมณฑล และต่างจังหวัด โดยสามารถประเมินค่าขนส่งและทีมงานตามสถานที่จัดงาน'
    }
];

function JsonLd() {
    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: 'เช่าจอ LED กรุงเทพ พร้อมติดตั้ง',
        serviceType: 'LED screen rental',
        description: 'บริการเช่าจอ LED กรุงเทพและปริมณฑล สำหรับงานแต่ง งานสัมมนา งานเปิดตัวสินค้า และอีเว้นท์ พร้อมทีมติดตั้งมืออาชีพ',
        provider: {
            '@type': 'LocalBusiness',
            '@id': `${baseUrl}/#localbusiness`,
            name: 'SET EVENT Thailand',
            url: baseUrl,
            telephone: '+66-93-726-5055'
        },
        areaServed: serviceAreas.map((area) => ({
            '@type': 'AdministrativeArea',
            name: area
        })),
        offers: {
            '@type': 'Offer',
            priceCurrency: 'THB',
            availability: 'https://schema.org/InStock',
            url: pageUrl
        }
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'หน้าแรก',
                item: baseUrl
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'เช่าจอ LED กรุงเทพ',
                item: pageUrl
            }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        </>
    );
}

export default function LedScreenRentalBangkokPage() {
    return (
        <>
            <JsonLd />
            <Box sx={{ bgcolor: 'var(--background)', color: 'var(--foreground)', overflow: 'hidden' }}>
                <Box component="section" sx={{ position: 'relative', minHeight: { xs: 680, md: 760 }, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#0a0a0a' }}>
                        <Image
                            src="/images/banner_event.png"
                            alt="เช่าจอ LED กรุงเทพ พร้อมติดตั้งสำหรับงานอีเว้นท์"
                            fill
                            priority
                            sizes="100vw"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.68)' }} />
                    </Box>

                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 14, md: 18 }, pb: { xs: 8, md: 10 } }}>
                        <Stack spacing={3} sx={{ maxWidth: 820 }}>
                            <Chip
                                label="LED Screen Rental Bangkok"
                                sx={{
                                    width: 'fit-content',
                                    bgcolor: 'rgba(255,255,255,0.12)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.22)',
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 700
                                }}
                            />
                            <Typography
                                component="h1"
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 800,
                                    color: 'white',
                                    lineHeight: 1.08,
                                    fontSize: { xs: '2.4rem', md: '4.8rem' }
                                }}
                            >
                                เช่าจอ LED กรุงเทพ พร้อมติดตั้งสำหรับงานอีเว้นท์
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    color: 'rgba(255,255,255,0.84)',
                                    fontSize: { xs: '1rem', md: '1.35rem' },
                                    lineHeight: 1.8,
                                    maxWidth: 760
                                }}
                            >
                                SET EVENT Thailand ให้บริการเช่าจอ LED ในกรุงเทพและปริมณฑล สำหรับงานแต่งงาน งานสัมมนา งานเปิดตัวสินค้า คอนเสิร์ต และงานองค์กร พร้อมทีมติดตั้ง ระบบภาพ และทีมเทคนิคดูแลหน้างาน
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    href="/contact"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        bgcolor: 'var(--primary)',
                                        color: 'white',
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.6,
                                        '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary) 82%, black)' }
                                    }}
                                >
                                    ขอใบเสนอราคา
                                </Button>
                                <Button
                                    component="a"
                                    href="https://line.me/ti/p/~@setevent"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.6,
                                        '&:hover': { borderColor: '#06C755', bgcolor: '#06C755' }
                                    }}
                                >
                                    แอด LINE @setevent
                                </Button>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>

                <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
                            <Stack spacing={2.5}>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--primary)', fontWeight: 800, letterSpacing: 1 }}>
                                    WHY SET EVENT
                                </Typography>
                                <Typography component="h2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2 }}>
                                    จอ LED คมชัด พร้อมทีมที่เข้าใจหน้างานจริง
                                </Typography>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.75, lineHeight: 1.9, fontSize: '1.05rem' }}>
                                    งานอีเว้นท์ไม่ได้จบที่การมีจอ แต่ต้องวางตำแหน่ง ขนาด ระยะมองเห็น คอนเทนต์ ระบบสัญญาณ และทีมเทคนิคให้เหมาะกับสถานที่ SET EVENT ช่วยดูตั้งแต่การเลือกสเปกจนถึงควบคุมหน้างาน
                                </Typography>
                            </Stack>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                {[
                                    'สำรวจพื้นที่และแนะนำขนาดจอ',
                                    'ติดตั้งโดยทีมเทคนิคมืออาชีพ',
                                    'รองรับงานแต่ง งานสัมมนา และงานองค์กร',
                                    'จัดระบบภาพร่วมกับแสง เสียง และเวที'
                                ].map((item) => (
                                    <Paper key={item} elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)', color: 'var(--foreground)', boxShadow: 'var(--card-shadow)' }}>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, lineHeight: 1.6 }}>
                                            {item}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    </Container>
                </Box>

                <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'color-mix(in srgb, var(--foreground) 4%, transparent)' }}>
                    <Container maxWidth="lg">
                        <Stack spacing={2} sx={{ textAlign: 'center', mb: 5 }}>
                            <Typography component="h2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                เหมาะกับงานประเภทไหนบ้าง
                            </Typography>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.7, maxWidth: 720, mx: 'auto', lineHeight: 1.8 }}>
                                บริการเช่าจอ LED กรุงเทพของเราปรับสเปกได้ตามรูปแบบงาน ขนาดพื้นที่ และจำนวนผู้ร่วมงาน
                            </Typography>
                        </Stack>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                            {useCases.map((item) => (
                                <Paper key={item.title} elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)', color: 'var(--foreground)', boxShadow: 'var(--card-shadow)', minHeight: 220 }}>
                                    <Typography component="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: '1.3rem', mb: 1.5 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.72, lineHeight: 1.8 }}>
                                        {item.text}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Container>
                </Box>

                <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 5, md: 8 } }}>
                            <Stack spacing={3}>
                                <Typography component="h2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                    พื้นที่ให้บริการ
                                </Typography>
                                <Typography sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.72, lineHeight: 1.9 }}>
                                    ทีม SET EVENT ให้บริการเช่าจอ LED ในกรุงเทพและพื้นที่ใกล้เคียง พร้อมวางแผนการขนส่ง การติดตั้ง และเวลาเข้าพื้นที่ตามเงื่อนไขของสถานที่จัดงาน
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1.2}>
                                    {serviceAreas.map((area) => (
                                        <Chip key={area} label={area} sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, bgcolor: 'color-mix(in srgb, var(--primary) 14%, transparent)', color: 'var(--primary)', border: '1px solid color-mix(in srgb, var(--primary) 22%, transparent)' }} />
                                    ))}
                                </Stack>
                            </Stack>
                            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)', color: 'var(--foreground)', boxShadow: 'var(--card-shadow)' }}>
                                <Typography component="h2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' }, mb: 2 }}>
                                    ขอราคาเช่าจอ LED ต้องเตรียมข้อมูลอะไร
                                </Typography>
                                <Stack component="ol" spacing={1.5} sx={{ pl: 3, m: 0 }}>
                                    {[
                                        'วันที่จัดงานและสถานที่จัดงาน',
                                        'ประเภทงานและจำนวนผู้ร่วมงานโดยประมาณ',
                                        'ขนาดเวทีหรือพื้นที่ติดตั้งจอ',
                                        'ต้องการระบบเสียง แสง เวที หรือทีมควบคุมเพิ่มเติมหรือไม่'
                                    ].map((item) => (
                                        <Typography component="li" key={item} sx={{ fontFamily: 'var(--font-prompt)', lineHeight: 1.8, opacity: 0.76 }}>
                                            {item}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Paper>
                        </Box>
                    </Container>
                </Box>

                <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}>
                    <Container maxWidth="md">
                        <Typography component="h2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, textAlign: 'center', mb: 5 }}>
                            คำถามที่พบบ่อย
                        </Typography>
                        <Stack spacing={2}>
                            {faqs.map((faq) => (
                                <Paper key={faq.question} elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)', color: 'var(--foreground)', boxShadow: 'var(--card-shadow)' }}>
                                    <Typography component="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: '1.15rem', mb: 1 }}>
                                        {faq.question}
                                    </Typography>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.72, lineHeight: 1.8 }}>
                                        {faq.answer}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    </Container>
                </Box>

                <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: 'var(--primary)', background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, black) 100%)', color: 'white' }}>
                    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                        <Typography component="h2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
                            ต้องการเช่าจอ LED สำหรับงานในกรุงเทพ?
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', opacity: 0.86, lineHeight: 1.8, mb: 4, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                            ส่งรายละเอียดงานให้ทีม SET EVENT ประเมินสเปกและงบประมาณที่เหมาะกับหน้างานของคุณ
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                            <Button href="/contact" variant="contained" size="large" sx={{ bgcolor: 'white', color: 'var(--primary)', fontFamily: 'var(--font-prompt)', fontWeight: 800, borderRadius: 2, px: 4, py: 1.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.88)' } }}>
                                ติดต่อขอใบเสนอราคา
                            </Button>
                            <Button href="/products" variant="outlined" size="large" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-prompt)', fontWeight: 800, borderRadius: 2, px: 4, py: 1.5, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                                ดูสินค้าและบริการ
                            </Button>
                        </Stack>
                    </Container>
                </Box>
            </Box>
        </>
    );
}
