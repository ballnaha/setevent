"use client";

import React from "react";
import { Box, Typography, Button, Container, Stack, Paper } from "@mui/material";
import { ArrowRight, Star1, Medal, Monitor, Music, MagicStar } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";
import BannerSlider from "./components/BannerSlider";

// Mock data for services
const services = [
  {
    title: "เช่าอุปกรณ์ครบวงจร",
    desc: "บริการให้เช่าเวที แสง สี เสียง และจอ LED คุณภาพสูง พร้อมทีมงานติดตั้งมืออาชีพ",
    icon: <Monitor size="32" color="var(--primary)" variant="Bulk" />,
  },
  {
    title: "รับจัดงาน Event",
    desc: "รับจัดงานอีเว้นท์ งานแต่งงาน งานเปิดตัวสินค้า ดูแลตั้งแต่วางแผนจนจบงาน",
    icon: <MagicStar size="32" color="var(--primary)" variant="Bulk" />,
  },
  {
    title: "ระบบเสียงระดับโลก",
    desc: "เครื่องเสียงแบรนด์ชั้นนำ ให้คุณภาพเสียงที่คมชัด กระหึ่ม สมจริง ทุกงานแสดง",
    icon: <Music size="32" color="var(--primary)" variant="Bulk" />,
  },
];

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <BannerSlider />

      {/* Services Section */}
      <Box sx={{ py: 12, bgcolor: "var(--background)" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h6" sx={{ color: "var(--secondary)", fontFamily: "var(--font-comfortaa)", fontWeight: "bold", mb: 2, letterSpacing: 1.5 }}>
              OUR SERVICES
            </Typography>
            <Typography variant="h3" sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", fontWeight: "bold" }}>
              บริการของเรา
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {services.map((service, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  flex: "1 1 300px",
                  maxWidth: "380px",
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.05)',
                  bgcolor: 'var(--background)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                    borderColor: 'var(--primary)'
                  }
                }}
              >
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  bgcolor: 'rgba(0,194,203,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}>
                  {service.icon}
                </Box>
                <Typography variant="h5" sx={{ fontFamily: "var(--font-prompt)", fontWeight: "bold", mb: 2, color: 'var(--foreground)' }}>
                  {service.title}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "var(--font-prompt)", color: 'var(--foreground)', opacity: 0.7, lineHeight: 1.7 }}>
                  {service.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Box sx={{ py: 12, bgcolor: "#F8FAFC" }}> {/* Light gray bg for contrast */}
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={8} alignItems="center">
            <Box sx={{ flex: 1 }}>
              {/* Placeholder for an image - In real usage, use your generated 'service_equipment_rental' image here */}
              <Box sx={{
                height: '500px',
                width: '100%',
                bgcolor: 'var(--foreground)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)'
              }}>
                {/* You can replace this gradient with an actual Image component */}
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #2c3e50, #000000)' }} />
                <Box sx={{ position: 'absolute', bottom: 30, left: 30, right: 30, p: 3, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Medal size="40" color="var(--tertiary)" variant="Bold" />
                    <Box>
                      <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', color: 'black' }}>
                        การันตีผลงาน
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#555' }}>
                        ได้รับความไว้วางใจจากบริษัทชั้นนำกว่า 100+ แห่ง
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: "var(--secondary)", fontFamily: "var(--font-comfortaa)", fontWeight: "bold", mb: 2, letterSpacing: 1.5 }}>
                WHY CHOOSE US
              </Typography>
              <Typography variant="h3" sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", fontWeight: "bold", mb: 4 }}>
                ทำไมต้องเลือก <span style={{ color: 'var(--primary)' }}>SetEvent?</span>
              </Typography>

              <Stack spacing={4}>
                {[
                  { title: 'อุปกรณ์ทันสมัย', desc: 'เราอัปเดตอุปกรณ์ใหม่ล่าสุดเสมอ เพื่อให้งานของคุณล้ำสมัยที่สุด' },
                  { title: 'ทีมงานมืออาชีพ', desc: 'ประสบการณ์กว่า 10 ปี พร้อมแก้ปัญหาหน้างานได้ทันท่วงที' },
                  { title: 'ราคาที่จับต้องได้', desc: 'บริการคุณภาพระดับพรีเมียม ในราคาที่สมเหตุสมผลและคุ้มค่า' }
                ].map((item, i) => (
                  <Box key={i} sx={{ borderLeft: '4px solid var(--primary)', pl: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', color: 'var(--foreground)', mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.7 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 12, bgcolor: "var(--primary)", position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', color: 'white', mb: 3 }}>
            พร้อมเริ่มงานของคุณหรือยัง?
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(255,255,255,0.9)', mb: 6, fontWeight: 400 }}>
            ปรึกษาเราฟรี พร้อมรับใบเสนอราคาภายใน 24 ชั่วโมง
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "white",
              color: "var(--primary)",
              fontFamily: "var(--font-prompt)",
              borderRadius: "50px",
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              fontWeight: 'bold',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: "#f0f0f0",
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s'
            }}
          >
            ติดต่อเราทันที
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
