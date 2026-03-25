"use client";
import React from "react";
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ArrowDown2, InfoCircle } from "iconsax-react";

const faqData = [
  {
    q: "เช่าจอ LED ราคาเท่าไหร่ มีขนาดใดบ้าง?",
    a: "SET EVENT Thailand มีบริการเช่าจอ LED ราคาถูก เริ่มต้นเพียง 2,xxx บาท/ตร.ม. โดยเรามีจอ LED ทั้งแบบ Indoor (P1.x - P3.9) และ Outdoor (P3.9 ขึ้นไป) สามารถปรับแต่งขนาดได้ตามต้องการ เช่น 2x3ม., 3x4ม. หรือ 3x5ม. พร้อมทีมติดตั้งมืออาชีพดูแลตลอดงาน"
  },
  {
    q: "บริการจัดงานอีเว้นท์ราคาประหยัด ครอบคลุมอะไรบ้าง?",
    a: "เราเน้นการจัดงานราคาประหยัดที่เป็น End-to-End Solution ครอบคลุมตั้งแต่การบริการให้เช่าอุปกรณ์ (แสง สี เสียง จอ LED เวที โครงสร้าง) ไปจนถึงการวางแผนงาน (Planning) การออกแบบ (Design) และการติดตั้งหน้างาน (Installation) เพื่อให้ลูกค้าได้รับบริการที่คุ้มค่าที่สุดในงบประมาณที่กำหนด"
  },
  {
    q: "จัดงานแต่งงานราคาประหยัดกับ SET EVENT ดีอย่างไร?",
    a: "สำหรับการจัดงานแต่งงาน เราเน้นความสวยงามควบคู่กับความประหยัด โดยมีการดีไซน์ Backdrop, ระบบจอ LED สำหรับ Presentation และระบบเสียงคุณภาพสูงที่เหมาะสมกับสถานที่ ไม่ว่าจะเป็นงานในโรงแรมหรือพื้นที่กลางแจ้ง เรามีแพ็คเกจเริ่มต้นที่ช่วยให้คุณประหยัดงบได้มากกว่าการแยกเช่าอุปกรณ์"
  },
  {
    q: "บริการเช่าเครื่องเสียงและไฟเวทีของ SET EVENT มีมาตรฐานอย่างไร?",
    a: "เราใช้อุปกรณ์มาตรฐานระดับสากล ไม่ว่าจะเป็นระบบลำโพง Line Array, ไมโครโฟนไร้สายคุณภาพสูง และไฟพาร์ LED (Moving Head/Beam) ที่ให้แสงสีสดใส คมชัด สร้างบรรยากาศให้งานของคุณดูพรีเมียมและน่าประทับใจที่สุด"
  },
  {
    q: "สามารถขอใบเสนอราคาจัดงานอีเว้นท์ได้ทางไหนบ้าง?",
    a: "คุณสามารถคลิกปุ่ม 'ขอใบเสนอราคา' บนเว็บไซต์ของเรา หรือติดต่อผ่าน LINE Official: @setevent เพื่อแจ้งรายละเอียดงาน (วันที่, สถานที่, จำนวนแขก) ทีมงานของเราจะประเมินราคาและส่งใบเสนอราคาให้ภายใน 24 ชั่วโมง"
  },
  {
    q: "SET EVENT ให้บริการในพื้นที่ไหนบ้าง?",
    a: "เราให้บริการเช่าจอ LED และรับจัดงานอีเว้นท์ทั่วประเทศไทย โดยมีฐานปฏิบัติงานหลักในกรุงเทพมหานครและปริมณฑล พร้อมทีมงานที่สามารถเดินทางไปติดตั้งอุปกรณ์ได้ทุกจังหวัด ไม่ว่างานเล็กหรืองานสเกลคอนเสิร์ตใหญ่"
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
