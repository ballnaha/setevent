"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Stack,
    CircularProgress,
    Button
} from "@mui/material";
import { ArrowDown2, MessageQuestion, Call, Whatsapp } from "iconsax-react";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export default function FAQContent() {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await fetch('/api/faqs');
                if (res.ok) {
                    const data = await res.json();
                    setFaqs(data);
                }
            } catch (error) {
                console.error("Failed to fetch FAQs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const categories = ["ทั้งหมด", ...new Set(faqs.map(item => item.category))];

    const filteredFAQs = selectedCategory === "ทั้งหมด"
        ? faqs
        : faqs.filter(item => item.category === selectedCategory);

    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10 }}>
            {/* Header Section with Geometric background */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Decor */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(0, 194, 203, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(233, 69, 96, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack spacing={3} alignItems="center" textAlign="center">
                        <Chip
                            label="Help Center"
                            sx={{
                                bgcolor: 'rgba(0, 194, 203, 0.1)',
                                color: '#00C2CB',
                                border: '1px solid rgba(0, 194, 203, 0.2)',
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 500
                            }}
                        />
                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '4.5rem' },
                                color: 'var(--foreground)',
                                lineHeight: 1.1,
                                letterSpacing: '-1px'
                            }}
                        >
                            FREQUENTLY ASKED <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #00C2CB 0%, #E94560 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                QUESTIONS
                            </span>
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.7,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 600,
                                lineHeight: 1.8,
                                mx: 'auto'
                            }}
                        >
                            รวมคำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับบริการเช่าอุปกรณ์ จอ LED ระบบเสียง และการจัดงานอีเวนต์
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#00C2CB' }} />
                    </Box>
                ) : (
                    <>
                        {/* Category Filter */}
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                mb: 4,
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 1
                            }}
                        >
                            {categories.map((cat) => (
                                <Chip
                                    key={cat}
                                    label={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: selectedCategory === cat ? 'var(--foreground)' : 'transparent',
                                        color: selectedCategory === cat ? 'var(--background)' : 'var(--foreground)',
                                        opacity: selectedCategory === cat ? 1 : 0.7,
                                        border: '1px solid',
                                        borderColor: selectedCategory === cat ? 'var(--foreground)' : 'var(--foreground)',
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 500,
                                        transition: 'all 0.2s',
                                        py: 2.5,
                                        px: 1,
                                        '&:hover': {
                                            bgcolor: selectedCategory === cat ? 'var(--foreground)' : 'rgba(128,128,128,0.1)',
                                            opacity: 1
                                        }
                                    }}
                                />
                            ))}
                        </Stack>

                        {/* FAQ Accordions */}
                        <Box sx={{ mb: 8 }}>
                            {filteredFAQs.length > 0 ? (
                                filteredFAQs.map((faq) => (
                                    <Accordion
                                        key={faq.id}
                                        expanded={expanded === `panel${faq.id}`}
                                        onChange={handleChange(`panel${faq.id}`)}
                                        sx={{
                                            mb: 2,
                                            borderRadius: '16px !important',
                                            overflow: 'hidden',
                                            bgcolor: 'background.paper',
                                            backgroundImage: 'none',
                                            boxShadow: expanded === `panel${faq.id}`
                                                ? '0 10px 40px -10px rgba(0, 194, 203, 0.15)'
                                                : '0 4px 10px rgba(0,0,0,0.05)',
                                            border: '1px solid',
                                            borderColor: expanded === `panel${faq.id}` ? '#00C2CB' : 'divider',
                                            '&:before': { display: 'none' },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ArrowDown2 size={24} color={expanded === `panel${faq.id}` ? "#00C2CB" : "var(--foreground)"} />}
                                            sx={{
                                                py: 1,
                                                '& .MuiAccordionSummary-content': { my: 2 }
                                            }}
                                        >
                                            <Box>
                                                <Chip
                                                    label={faq.category}
                                                    size="small"
                                                    sx={{
                                                        mb: 1.5,
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontSize: '0.7rem',
                                                        bgcolor: 'rgba(0, 194, 203, 0.1)',
                                                        color: '#00C2CB',
                                                        fontWeight: 600,
                                                        height: 24
                                                    }}
                                                />
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    fontSize: '1.1rem',
                                                    lineHeight: 1.4
                                                }}>
                                                    {faq.question}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ pt: 0, pb: 3, px: 2 }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    color: 'text.primary',
                                                    fontWeight: 500,
                                                    whiteSpace: 'pre-line',
                                                    lineHeight: 1.8,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {faq.answer}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.9 }}>ไม่พบข้อมูลในหมวดหมู่นี้</Typography>
                                </Box>
                            )}
                        </Box>
                    </>
                )}

            </Container>
        </Box>
    );
}
