"use client";

import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link as MUILink, Typography, Box } from '@mui/material';
import { ArrowRight2, Home2 } from 'iconsax-react';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    center?: boolean;
}

export default function Breadcrumbs({ items, center = false }: BreadcrumbsProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://seteventthailand.com"
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": item.label,
                ...(item.href ? { "item": `https://seteventthailand.com${item.href}` } : {})
            }))
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Box sx={{ mb: 4, display: center ? 'flex' : 'block', justifyContent: center ? 'center' : 'initial' }}>
                <MUIBreadcrumbs
                    separator={<ArrowRight2 size="14" color="var(--primary)" variant="Bold" style={{ opacity: 0.5 }} />}
                    aria-label="breadcrumb"
                    sx={{
                        '& .MuiBreadcrumbs-ol': {
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: center ? 'center' : 'flex-start',
                        },
                        '& .MuiBreadcrumbs-li': {
                            minWidth: 0,
                        },
                    }}
                >
                    <MUILink
                        component={Link}
                        underline="hover"
                        href="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: 0,
                            color: 'var(--foreground)',
                            opacity: 0.6,
                            transition: 'all 0.2s',
                            '&:hover': {
                                opacity: 1,
                                color: 'var(--primary)',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        <Home2 size="18" variant="Bulk" style={{ marginRight: 8 }} />
                        <Typography sx={{ 
                            fontFamily: 'var(--font-prompt)', 
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word'
                        }}>
                            Home
                        </Typography>
                    </MUILink>

                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return isLast ? (
                            <Typography
                                key={index}
                                sx={{
                                    color: 'var(--primary)',
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.3px',
                                    textShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {item.label}
                            </Typography>
                        ) : (
                            <MUILink
                                key={index}
                                component={Link}
                                underline="hover"
                                href={item.href || '#'}
                                sx={{
                                    display: 'inline-flex',
                                    minWidth: 0,
                                    color: 'var(--foreground)',
                                    opacity: 0.6,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        opacity: 1,
                                        color: 'var(--primary)',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                <Typography sx={{ 
                                    fontFamily: 'var(--font-prompt)', 
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word'
                                }}>
                                    {item.label}
                                </Typography>
                            </MUILink>
                        );
                    })}
                </MUIBreadcrumbs>
            </Box>
        </>
    );
}
