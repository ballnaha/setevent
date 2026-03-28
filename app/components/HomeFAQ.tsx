"use client";
import React from "react";
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import { ArrowDown2, MessageQuestion, ArrowRight } from "iconsax-react";
import Link from "next/link";

const faqData = [
  {
    q: "บริการเช่าจอ LED ราคาถูก เริ่มต้นเท่าไหร่?",
    a: "SET EVENT Thailand มีบริการเช่าจอ LED ราคาพิเศษ:\n• ราคาเริ่มต้นเพียง 2,xxx บาท/ตร.ม.\n• จอ LED คุณภาพสูงทั้ง Indoor (P2.5, P3.9)\n• จอ Outdoor สำหรับงานอีเว้นท์กลางแจ้งสู้แสงแดด\n• พร้อมบริการติดตั้งด่วนในพื้นที่กรุงเทพและปริมณฑล"
  },
  {
    q: "รับจัดงานอีเว้นท์ครอบคลุมพื้นที่ไหนบ้าง?",
    a: "เราให้บริการจัดงานอีเว้นท์ทั่วประเทศไทย โดยเน้นพื้นที่:\n• กรุงเทพฯ และปริมณฑล (นนทบุรี, ปทุมธานี, สมุทรปราการ)\n• ชลบุรี, ระยอง (พื้นที่ EEC)\n• หัวหิน, ภูเก็ต และจังหวัดท่องเที่ยวสำคัญ\n• บริการครอบคลุมทั้งงานเปิดตัวสินค้า, งานเลี้ยงบริษัท และงานสัมมนา"
  },
  {
    q: "แพ็คเกจจัดงานแต่งงานของ SET EVENT มีอะไรบ้าง?",
    a: "แพ็คเกจแต่งงานของเราเน้นความคุ้มค่าแบบ One-Stop Service:\n• เช่าจอ LED สำหรับเปิดพรีเซนเทชั่นและ Live สด\n• ระบบเครื่องเสียงงานแต่งคุณภาพมาตรฐาน\n• ไฟพาร์สร้างบรรยากาศ และไฟส่องสว่างบนเวที\n• Backdrop และงานดอกไม้ดีไซน์พรีเซนเทชั่น"
  },
  {
    q: "เช่าเครื่องเสียงและไฟเวที ราคาเป็นอย่างไร?",
    a: "เรามีระบบแสงสีเสียงรองรับทุกขนาดงาน:\n• งานสัมมนาขนาดเล็ก (30-100 คน)\n• งานเลี้ยงบริษัทขนาดกลาง (100-500 คน)\n• งานคอนเสิร์ตขนาดใหญ่ (500 คนขึ้นไป)\n• อุปกรณ์เป็นแบรนด์เนมมาตรฐานสากล ให้คุณภาพเสียงที่คมชัด"
  },
  {
    q: "ขั้นตอนการขอใบเสนอราคาต้องทำอย่างไร?",
    a: "ขั้นตอนง่ายๆ เพื่อรับข้อเสนอราคาภายใน 24 ชม.:\n• คลิกปุ่ม 'ขอใบเสนอราคา' หรือแอดไลน์ @setevent\n• แจ้งวันที่, สถานที่ และประเภทงานที่ต้องการจัด\n• แจ้งงบประมาณที่วางไว้เพื่อให้ทีมงานเสนอแพ็คเกจที่คุ้มที่สุด"
  }
];

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function HomeFAQ({ initialFaqs }: { initialFaqs?: FAQItem[] }) {
  const displayData = initialFaqs && initialFaqs.length > 0
    ? initialFaqs.map(f => ({ q: f.question, a: f.answer }))
    : faqData.slice(0, 5); // Fallback to first 5 if no DB data

  const [expanded, setExpanded] = React.useState<number | false>(false);

  const handleChange = (panel: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": displayData.map((item: { q: string, a: string }) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <Box component="section" sx={{
      py: { xs: 10, md: 15 },
      bgcolor: 'var(--background)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--decor-cyan) 0%, rgba(0,0,0,0) 70%)',
        opacity: 0.15,
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 6, md: 8 }
        }}>
          {/* Left Side: Header */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{
              display: 'inline-flex',
              p: 1.5,
              borderRadius: '12px',
              bgcolor: 'rgba(0, 194, 203, 0.1)',
              color: '#00C2CB',
              mb: 3
            }}>
              <MessageQuestion size={32} variant="Bulk" color="#00C2CB" />
            </Box>

            <Typography variant="h2" sx={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              color: 'var(--foreground)',
              lineHeight: 1.2
            }}>
              มีข้อสงสัย <br />
              <span style={{ color: '#00C2CB' }}>ต้องการคำตอบ?</span>
            </Typography>

            <Typography sx={{
              fontFamily: 'var(--font-prompt)',
              color: 'var(--foreground)',
              opacity: 0.7,
              fontSize: '1.1rem',
              mb: 4,
              maxWidth: 450,
              mx: { xs: 'auto', md: 0 }
            }}>
              รวบรวมคำถามที่พบบ่อยเกี่ยวกับการเช่าจอ LED และการจัดงานอีเว้นท์ เพื่อช่วยให้คุณตัดสินใจได้ง่ายขึ้น
            </Typography>

            <Button
              component={Link}
              href="/faq"
              variant="contained"
              endIcon={<ArrowRight size={20} variant="TwoTone" color="currentColor" />}
              sx={{
                bgcolor: 'var(--foreground)',
                color: 'var(--background)',
                px: 4,
                py: 2,
                borderRadius: '50px',
                fontFamily: 'var(--font-prompt)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#00C2CB',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px rgba(0, 194, 203, 0.2)'
                },
                transition: 'all 0.3s ease',
                display: { xs: 'none', md: 'inline-flex' }
              }}
            >
              ดูคำถามทั้งหมด
            </Button>
          </Box>

          <Box sx={{ flex: 1.5 }}>
            {displayData.map((item: { q: string, a: string }, index: number) => (
              <Accordion
                key={index}
                elevation={0}
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{
                  bgcolor: 'var(--card-bg)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px !important',
                  mb: 2.5,
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    borderColor: '#00C2CB',
                    boxShadow: 'var(--card-shadow)',
                    '& .MuiAccordionSummary-root': {
                      bgcolor: 'rgba(0, 194, 203, 0.03)'
                    }
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDown2 size={22} color={expanded === index ? "#00C2CB" : "var(--foreground)"} />}
                  sx={{ py: 1.5, px: 3 }}
                >
                  <Typography sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: expanded === index ? "#00C2CB" : "var(--foreground)",
                    pr: 2,
                    transition: 'color 0.3s ease'
                  }}>
                    {item.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 1, pb: 4, px: 4 }}>
                  <Typography sx={{
                    fontFamily: 'var(--font-prompt)',
                    color: 'var(--foreground)',
                    opacity: 0.8,
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                    whiteSpace: 'pre-line'
                  }}>
                    {item.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}

            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 4 }}>
              <Button
                component={Link}
                href="/faq"
                variant="outlined"
                endIcon={<ArrowRight size={20} variant="TwoTone" color="currentColor" />}
                sx={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--foreground)',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontFamily: 'var(--font-prompt)',
                  textTransform: 'none',
                }}
              >
                ดูคำถามทั้งหมด
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
