"use client";
import React from "react";
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ArrowDown2, InfoCircle } from "iconsax-react";

const faqData = [
  {
    q: "บริการเช่าจอ LED ราคาถูก สำหรับงานแต่งงานหรืองานสัมมนา เริ่มต้นเท่าไหร่?",
    a: "SET EVENT Thailand มีบริการเช่าจอ LED ราคาถูก เริ่มต้นเพียง 2,xxx บาท/ตร.ม. เรามีจอ LED คุณภาพสูงทั้ง Indoor (P2.5, P3.9) สำหรับงานแต่งในโรงแรม และ Outdoor สำหรับงานอีเว้นท์กลางแจ้ง พร้อมติดตั้งด่วนในพื้นที่กรุงเทพและปริมณฑล"
  },
  {
    q: "รับจัดงานอีเว้นท์ราคาประหยัด ครอบคลุมพื้นที่ไหนบ้าง?",
    a: "เราให้บริการรับจัดงานอีเว้นท์ราคาประหยัดทั่วประเทศไทย โดยเน้นพื้นที่กรุงเทพฯ นนทบุรี ปทุมธานี ชลบุรี ภูเก็ต และสมุทรปราการ ครอบคลุมทั้งงานเปิดตัวสินค้า งานเลี้ยงบริษัท และงานสัมมนาวิชาการแบบครบวงจร"
  },
  {
    q: "แพ็คเกจจัดงานแต่งงานราคาประหยัดของ SET EVENT มีอะไรบ้าง?",
    a: "แพ็คเกจจัดงานแต่งงานของเราเน้นความคุ้มค่า โดยรวมบริการเช่าจอ LED สำหรับพรีเซนเทชั่น, ระบบเครื่องเสียงงานแต่ง, ไฟพาร์สร้างบรรยากาศ และ Backdrop สวยงาม ในงบประมาณที่ประหยัดกว่าการเช่าแยกชิ้น"
  },
  {
    q: "เช่าเครื่องเสียงและไฟเวที สำหรับงานอีเว้นท์ขนาดเล็กไปถึงใหญ่ ราคาอย่างไร?",
    a: "เรามีระบบแสงสีเสียงมาตรฐานสากล รองรับทั้งงานสัมมนาขนาดเล็ก (30-50 คน) ไปจนถึงงานคอนเสิร์ตขนาดใหญ่ อุปกรณ์ทุกชิ้นเป็นแบรนด์เนมมาตรฐาน ให้ความเสถียรและคุณภาพเสียงที่คมชัดที่สุดในราคาที่เป็นกันเอง"
  },
  {
    q: "ขั้นตอนการขอใบเสนอราคาเช่าอุปกรณ์จัดงาน ต้องทำอย่างไร?",
    a: "ง่ายๆ เพียงคลิกปุ่ม 'ขอใบเสนอราคา' หรือแอดไลน์ @setevent แจ้งรายละเอียดงาน เช่น วันที่ สถานที่ และประเภทงาน (เช่น งานแต่งงานหรืองานสัมมนา) เราจะส่งใบเสนอราคาเบื้องต้นให้คุณภายใน 24 ชั่วโมง"
  }
];

export default function HomeFAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <Box component="section" sx={{ pb: 15, bgcolor: 'var(--background)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Container maxWidth="md">
        <Box textAlign="center" mb={6}>
          <Box sx={{
            display: 'inline-flex',
            p: 1.5,
            borderRadius: '50%',
            bgcolor: 'var(--decor-emerald)',
            color: 'var(--primary)',
            mb: 2
          }}>
            <InfoCircle size={32} variant="Bulk" color="var(--primary)" />
          </Box>
          <Typography variant="h3" sx={{
            fontFamily: 'var(--font-prompt)',
            fontWeight: 800,
            mb: 1.5,
            color: 'var(--foreground)'
          }}>
            คำถามที่พบบ่อย (FAQ)
          </Typography>
          <Typography sx={{
            fontFamily: 'var(--font-prompt)',
            color: 'var(--foreground)',
            opacity: 0.7
          }}>
            รวบรวมข้อมูลที่คุณต้องการทราบเกี่ยวกับการเช่าจอ LED และการจัดงานอีเว้นท์ราคาประหยัด
          </Typography>
        </Box>

        <Box>
          {faqData.map((item, index) => (
            <Accordion
              key={index}
              elevation={0}
              sx={{
                bgcolor: 'var(--card-bg)',
                color: 'var(--foreground)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px !important',
                mb: 2,
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  border: '1px solid var(--primary)',
                  boxShadow: 'var(--card-shadow)'
                }
              }}
            >
              <AccordionSummary expandIcon={<ArrowDown2 size={20} color="var(--foreground)" />}>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: 'var(--foreground)' }}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 3, px: { xs: 2, md: 4 } }}>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.8, lineHeight: 1.8 }}>
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
