"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Stack, Button, Skeleton } from "@mui/material";
import { Call, Message, Location, Instagram, Facebook, Sms } from "iconsax-react";

interface ContactSettings {
    address: string;
    phone: string;
    email: string;
    line: string;
    lineUrl: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    mapUrl: string;
}

const DEFAULT_SETTINGS: ContactSettings = {
    address: "123/45 ถนนนวมินทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กทม. 10240",
    phone: "081-234-5678",
    email: "contact@seteventthailand.com",
    line: "@setevent",
    lineUrl: "https://line.me/ti/p/~@setevent",
    facebook: "",
    instagram: "",
    tiktok: "",
    mapUrl: ""
};

export default function ContactContent() {
    const [settings, setSettings] = useState<ContactSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/contact');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching contact settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const contactItems = [
        {
            icon: <Location size="28" variant="Bulk" color="var(--primary)" />,
            title: "ที่อยู่",
            desc: settings.address
        },
        {
            icon: <Call size="28" variant="Bulk" color="var(--primary)" />,
            title: "โทรศัพท์",
            desc: settings.phone,
            link: `tel:${settings.phone.replace(/-/g, '')}`
        },
        {
            icon: <Sms size="28" variant="Bulk" color="var(--primary)" />,
            title: "อีเมล",
            desc: settings.email,
            link: `mailto:${settings.email}`
        },
        {
            icon: <Message size="28" variant="Bulk" color="var(--primary)" />,
            title: "LINE",
            desc: settings.line,
            link: settings.lineUrl
        }
    ];

    const socialItems = [
        ...(settings.facebook ? [{ icon: <Facebook size="22" variant="Bold" color="var(--primary)" />, label: 'Facebook', url: settings.facebook }] : []),
        ...(settings.instagram ? [{ icon: <Instagram size="22" variant="Bold" color="var(--primary)" />, label: 'Instagram', url: settings.instagram }] : []),
        ...(settings.tiktok ? [{
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--primary)"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>,
            label: 'TikTok',
            url: settings.tiktok
        }] : [])
    ];

    return (
        <React.Fragment>
            {/* Hero Section - Soft Dark */}
            {/* Hero Section - Soft Dark */}
            <Box sx={{
                position: 'relative',
                minHeight: { xs: 'auto', md: '400px' },
                bgcolor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                py: { xs: 8, md: 0 }
            }}>
                {/* Soft Dark Gradient Background */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                }} />

                {/* Diagonal Lines Pattern */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.08,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 11px)',
                }} />

                {/* Subtle Accent */}
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(10, 92, 90, 0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    display: { xs: 'none', md: 'block' }
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 700,
                        color: 'white',
                        fontSize: { xs: '1.2rem', md: '4rem' },
                        lineHeight: 1.2,
                        mb: { xs: 1, md: 2 },
                        pt: { xs: 5, md: 0 }
                    }}>
                        CONTACT US
                    </Typography>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 300,
                        fontSize: { xs: '0.85rem', md: '1.25rem' },
                        maxWidth: '500px',
                        mx: 'auto'
                    }}>
                        พร้อมให้บริการและคำปรึกษา
                    </Typography>
                </Container>
            </Box>

            {/* Contact Info Section */}
            <Box id="contact-info" sx={{ py: { xs: 6, md: 8 }, bgcolor: 'var(--background)' }}>
                <Container maxWidth="lg">
                    {/* Section Header */}
                    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                        <Typography sx={{
                            color: "var(--primary)",
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            mb: 1,
                            textTransform: 'uppercase',
                            letterSpacing: 2
                        }}>
                            Contact
                        </Typography>
                        <Typography sx={{
                            color: "var(--foreground)",
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 700,
                            fontSize: { xs: '1.5rem', md: '2rem' }
                        }}>
                            ช่องทางการติดต่อ
                        </Typography>
                    </Box>

                    {/* Contact Cards Grid */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: { xs: 2, md: 3 }
                    }}>
                        {loading ? (
                            // Loading Skeletons
                            [1, 2, 3, 4].map((i) => (
                                <Box key={i} sx={{ p: { xs: 3, md: 4 }, borderRadius: '16px', bgcolor: 'rgba(0,0,0,0.02)' }}>
                                    <Skeleton variant="circular" width={56} height={56} sx={{ mx: 'auto', mb: 2 }} />
                                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 1 }} />
                                    <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
                                </Box>
                            ))
                        ) : (
                            contactItems.map((item, index) => (
                                <Box key={index} sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: '16px',
                                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                                    border: '1px solid rgba(0, 0, 0, 0.05)',
                                    textAlign: 'center',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: 'rgba(10, 92, 90, 0.05)',
                                        borderColor: 'var(--primary)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}>
                                    <Box sx={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '12px',
                                        bgcolor: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                    }}>
                                        {item.icon}
                                    </Box>
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 600,
                                        color: 'var(--foreground)',
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        mb: 0.5
                                    }}>
                                        {item.title}
                                    </Typography>
                                    {item.link ? (
                                        <Typography
                                            component="a"
                                            href={item.link}
                                            target={item.link.startsWith('http') ? '_blank' : '_self'}
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                color: 'var(--foreground)',
                                                opacity: 0.7,
                                                fontSize: { xs: '0.875rem', md: '0.95rem' },
                                                textDecoration: 'none',
                                                display: 'block',
                                                '&:hover': { color: 'var(--primary)', opacity: 1 }
                                            }}
                                        >
                                            {item.desc}
                                        </Typography>
                                    ) : (
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            color: 'var(--foreground)',
                                            opacity: 0.7,
                                            fontSize: { xs: '0.875rem', md: '0.95rem' },
                                            lineHeight: 1.5
                                        }}>
                                            {item.desc}
                                        </Typography>
                                    )}
                                </Box>
                            ))
                        )}
                    </Box>

                    {/* Social Media */}
                    {socialItems.length > 0 && (
                        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: { xs: 4, md: 6 } }}>
                            {socialItems.map((social, index) => (
                                <Button
                                    key={index}
                                    component="a"
                                    href={social.url}
                                    target="_blank"
                                    variant="outlined"
                                    sx={{
                                        minWidth: 0,
                                        width: '44px',
                                        height: '44px',
                                        p: 0,
                                        borderRadius: '12px',
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        color: 'var(--foreground)',
                                        '&:hover': {
                                            borderColor: 'var(--primary)',
                                            color: 'var(--primary)',
                                            bgcolor: 'rgba(10, 92, 90, 0.05)'
                                        }
                                    }}
                                >
                                    {social.icon}
                                </Button>
                            ))}
                        </Stack>
                    )}

                    {/* Google Map */}
                    {settings.mapUrl && (
                        <Box sx={{
                            mt: { xs: 6, md: 8 },
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            height: { xs: '300px', md: '450px' },
                            bgcolor: 'rgba(0,0,0,0.05)'
                        }}>
                            <iframe
                                src={settings.mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </Box>
                    )}
                </Container>
            </Box>
        </React.Fragment>
    );
}
