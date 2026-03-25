"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Typography } from "@mui/material";

export default function BannerSlider() {
    return (
        <section style={{ width: "100%", minHeight: "60vh", position: "relative", overflow: 'hidden' }} className="hero-section">
            {/* Background Image Container */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                backgroundColor: '#051f1e', // Rich dark teal base
            }}>
                {/* Image with Vibrant Overlay */}
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                        src="/images/banner1-4.webp"
                        alt="SET EVENT Thailand - บริการเช่าจอ LED งานแต่ง งานสัมมนา และรับจัดงานอีเว้นท์ราคาถูก ครบวงจร"
                        fill
                        priority
                        sizes="100vw"
                        quality={90}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            opacity: 0.8, // Clearer visibility of LED screen
                            filter: 'brightness(1.1) contrast(1.1)',
                        }}
                    />
                    {/* Gradient Overlays for Depth and Branding */}
                    <div className="vibrant-overlay" />
                    <div className="glow-effect" />
                    
                    {/* Geometric Triangle Accents (The requested elements) */}
                    <div className="triangle-shape ts-1" />
                    <div className="triangle-shape ts-2" />
                    <div className="triangle-shape ts-3" />
                </div>

                {/* Dot Pattern Overlay */}
                <div className="dot-overlay" />
            </div>

            {/* Content Overlay */}
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="hero-main-title">
                        <span className="led-highlight">LED SCREEN</span> <br className="mobile-only" /> & EVENT SOLUTIONS
                    </span>
                    <span className="hero-thai-keywords">
                        เช่าจอ LED ราคาถูก · งานแต่ง · งานสัมมนา · จัดอีเว้นท์ครบวงจร
                    </span>
                </h1>

                <p className="hero-subtitle">
                    PROFESSIONAL TEAM & PREMIUM EQUIPMENT
                </p>

                <p className="hero-description">
                    ยกระดับงานแต่งงานหรืองานสัมมนาของคุณด้วยระบบจอ LED แสง สี เสียง และเวทีคุณภาพมาตรฐานสากล <br className="desktop-only" />
                    พร้อมทีมงานมืออาชีพที่ดูแลคุณทั่วกรุงเทพและปริมณฑล ในราคาเช่าที่คุ้มค่าที่สุด
                </p>

                <div className="hero-actions">
                    <Link href="/products" className="btn-primary">
                        ดูบริการทั้งหมด
                    </Link>
                    <Link href="/contact" className="btn-secondary">
                        ขอใบเสนอราคา
                    </Link>
                </div>

                <div className="hero-footer">
                    <Typography variant="h2" sx={{ 
                        fontFamily: 'var(--font-prompt)', 
                        fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                        fontWeight: 600,
                        opacity: 0.9,
                        letterSpacing: '2px',
                        color: 'white',
                        textTransform: 'uppercase'
                    }}>
                        End-to-End Event Solution
                    </Typography>
                </div>
            </div>

            <style>{`
                .hero-section {
                    min-height: 100vh;
                    width: 100%;
                    position: relative;
                    background-color: #051f1e;
                }
                .vibrant-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(
                        circle at center, 
                        rgba(10, 92, 90, 0.2) 0%, 
                        rgba(5, 31, 30, 0.6) 60%, 
                        rgba(0, 0, 0, 0.9) 100%
                    );
                }
                .glow-effect {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 70%;
                    height: 70%;
                    background: radial-gradient(circle, rgba(10, 92, 90, 0.4) 0%, transparent 70%);
                    filter: blur(100px);
                    z-index: 1;
                }
                
                /* Requested Triangular Shapes */
                .triangle-shape {
                    position: absolute;
                    opacity: 0.5; /* Increased for better visibility */
                    filter: blur(1px);
                    pointer-events: none;
                    z-index: 2;
                }
                .ts-1 {
                    top: 15%;
                    right: 8%;
                    width: 450px; /* Bigger */
                    height: 450px;
                    background: linear-gradient(135deg, var(--primary), transparent);
                    clip-path: polygon(100% 0, 0 0, 100% 100%);
                }
                .ts-2 {
                    bottom: 12%;
                    left: 6%;
                    width: 350px; /* Bigger */
                    height: 350px;
                    background: linear-gradient(315deg, #00ffd5, transparent);
                    clip-path: polygon(0 100%, 0 0, 100% 100%);
                }
                .ts-3 {
                    top: 40%;
                    left: 2%;
                    width: 300px; /* Bigger red accent */
                    height: 300px;
                    background: linear-gradient(135deg, rgba(233, 69, 96, 0.4), transparent); /* Brand Red Accent #E94560 */
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                    filter: blur(50px); /* Soft energy glow */
                }

                .dot-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .hero-content {
                    position: relative;
                    z-index: 2;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 140px 40px 80px 40px; /* Increased top padding to avoid menu */
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .hero-title {
                    margin-bottom: 25px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: relative;
                }
                .hero-main-title {
                    font-family: var(--font-prompt);
                    font-weight: 900;
                    font-size: clamp(3rem, 7.5vw, 6.5rem);
                    line-height: 1.1;
                    color: white;
                    letter-spacing: -2px;
                    text-transform: uppercase;
                    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.8));
                }
                .led-highlight {
                    background: linear-gradient(135deg, #ffffff 0%, #00ffd5 50%, #1de9b6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 10px 40px rgba(10, 92, 90, 0.4);
                    filter: drop-shadow(0 2px 10px rgba(0,0,0,0.5));
                }
                .hero-thai-keywords {
                    font-family: var(--font-prompt);
                    font-size: clamp(1.2rem, 2.8vw, 2.1rem);
                    font-weight: 700;
                    color: #f1f8f7; /* Bright off-white with teal hint */
                    margin-top: 15px;
                    letter-spacing: 1.5px;
                    position: relative;
                    padding: 8px 30px;
                    background: rgba(10, 92, 90, 0.25); /* Stronger background for contrast */
                    border-left: 4px solid #00ffd5;
                    border-right: 4px solid #00ffd5;
                    width: fit-content;
                    margin-left: auto;
                    margin-right: auto;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    text-shadow: 0 2px 10px rgba(0, 92, 90, 0.4);
                }
                .hero-subtitle {
                    font-family: var(--font-prompt);
                    font-size: clamp(1rem, 2vw, 1.3rem);
                    font-weight: 700;
                    color: white;
                    letter-spacing: 6px;
                    opacity: 0.8;
                    margin-bottom: 24px;
                    text-transform: uppercase;
                }
                .hero-description {
                    font-family: var(--font-prompt);
                    font-size: clamp(1rem, 1.4vw, 1.25rem);
                    color: rgba(255,255,255,0.85);
                    max-width: 850px;
                    line-height: 1.8;
                    font-weight: 400;
                    margin-bottom: 10px;
                }
                .hero-actions {
                    display: flex;
                    gap: 20px;
                    margin-top: 40px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .btn-primary, .btn-secondary {
                    padding: 14px 36px;
                    border-radius: 50px;
                    font-family: var(--font-prompt);
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    text-align: center;
                    min-width: 180px;
                }
                .btn-primary {
                    background: #E94560; /* Brand Red Signature */
                    color: white;
                    box-shadow: 0 10px 30px rgba(233, 69, 96, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .btn-primary:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(233, 69, 96, 0.6);
                    filter: brightness(1.1);
                    background: #d13a53; /* Darker Brand Red */
                }
                .btn-secondary {
                    border: 2px solid rgba(255,255,255,0.3);
                    color: white;
                    backdrop-filter: blur(5px);
                }
                .btn-secondary:hover {
                    background: white;
                    color: black;
                    border-color: white;
                    transform: translateY(-5px);
                }
                .hero-footer {
                    margin-top: 60px;
                }
                
                .desktop-banner { display: block; }
                .mobile-banner { display: none; }
                .desktop-only { display: inline; }
                .mobile-only { display: none; }

                @media (max-width: 768px) {
                    .hero-section {
                        min-height: 80vh;
                    }
                    .hero-content {
                        min-height: 80vh;
                        padding-top: 140px; /* Increase padding to push down from logo */
                        padding-bottom: 60px;
                        justify-content: flex-start; /* Ensure it starts low enough */
                    }
                    .hero-title {
                        margin-bottom: 15px;
                    }
                    .hero-main-title {
                        font-size: clamp(2rem, 12vw, 3.5rem);
                        line-height: 1.1;
                    }
                    .desktop-banner { display: none; }
                    .mobile-banner { display: block; }
                    .desktop-only { display: none; }
                    .mobile-only { display: inline; }
                    .hero-actions {
                        flex-direction: column;
                        width: 100%;
                    }
                    .btn-primary, .btn-secondary {
                        width: 100%;
                    }
                }
            `}</style>
        </section>
    );
}
