import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function BannerSlider() {
    return (
        <section style={{ width: "100%", minHeight: "60vh", position: "relative", overflow: 'hidden' }} className="hero-section">
            {/* Background Image - Responsive for Mobile and Desktop to match preloads */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                backgroundColor: '#0a0a0a',
            }}>
                {/* Desktop Version */}
                <div className="desktop-banner" style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                        src="/images/banner1-4.webp"
                        alt="SET EVENT Thailand - บริการเช่าจอ LED เวที แสง เสียง และจัดงานอีเว้นท์ครบวงจร"
                        fill
                        priority
                        fetchPriority="high"
                        sizes="100vw"
                        quality={75}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            filter: 'grayscale(100%) brightness(0.4)'
                        }}
                    />
                </div>

                {/* Mobile Version */}
                <div className="mobile-banner" style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                        src="/images/banner1-4-mobile.webp"
                        alt="SET EVENT Thailand - บริการเช่าจอ LED เวที แสง เสียง และจัดงานอีเว้นท์ครบวงจร"
                        fill
                        priority
                        fetchPriority="high"
                        sizes="100vw"
                        quality={70}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            filter: 'grayscale(100%) brightness(0.4)'
                        }}
                    />
                </div>

                {/* Dot Pattern Overlay for Mobile */}
                <div className="mobile-dot-overlay" />
            </div>

            {/* Geometric Decor - Left Bottom (Desktop Only) */}
            <div className="desktop-only" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1 }}>
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 400V200L200 400H0Z" fill="#E94560" />
                    <path d="M0 200V0L200 200H0Z" fill="#0F3460" />
                    <path d="M200 400L400 400L200 200L200 400Z" fill="#C29B40" />
                    <rect x="50" y="250" width="100" height="100" fill="white" fillOpacity="0.1" />
                </svg>
            </div>

            {/* Geometric Decor - Right Bottom (Desktop Only) */}
            <div className="desktop-only" style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1 }}>
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M400 400V200L200 400H400Z" fill="#E94560" />
                    <path d="M400 200V0L200 200H400Z" fill="#0F3460" />
                    <path d="M200 400L0 400L200 200L200 400Z" fill="#C29B40" />
                </svg>
            </div>

            {/* Main Center Content */}
            <div className="hero-content">
                <h1 className="hero-title">
                    EVENT<br />RENTAL<br />SERVICE
                </h1>

                <p className="hero-subtitle">
                    PROFESSIONAL TEAM
                </p>

                <p className="hero-description">
                    รับจัดงานอีเว้นท์ · เช่าอุปกรณ์ครบวงจร · งานแต่งงาน · งานสัมมนา
                </p>

                <div className="hero-actions">
                    <Link href="/products" className="btn-primary">
                        บริการของเรา
                    </Link>
                    <Link href="/contact" className="btn-secondary">
                        ติดต่อสอบถาม
                    </Link>
                </div>

                <div className="hero-footer">
                    <h2 className="hero-footer-title">End-to-End Event Solution</h2>
                    <p className="hero-footer-text">ดูแลครบทุกขั้นตอน พร้อมอุปกรณ์ทันสมัย</p>
                </div>
            </div>

            <style>{`
                .hero-section {
                    min-height: 100vh;
                }
                @media (max-width: 900px) {
                    .hero-section {
                        min-height: 60vh;
                    }
                }
                .mobile-dot-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 24px 24px;
                }
                @media (min-width: 900px) {
                    .mobile-dot-overlay {
                        display: none;
                    }
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
                    padding: 120px 16px 32px;
                }
                @media (max-width: 900px) {
                    .hero-content {
                        min-height: 60vh;
                        padding-top: 96px;
                    }
                }
                .hero-title {
                    font-family: var(--font-prompt);
                    font-weight: 900;
                    color: white;
                    font-size: clamp(3.5rem, 15vw, 8.5rem);
                    line-height: 0.85;
                    letter-spacing: -2px;
                    text-transform: uppercase;
                    margin: 20px 0;
                    -webkit-text-stroke: 1px rgba(255,255,255,0.1);
                }
                .hero-subtitle {
                    font-family: var(--font-prompt);
                    font-weight: 700;
                    color: white;
                    font-size: clamp(1.2rem, 4vw, 2.2rem);
                    margin-top: 16px;
                    letter-spacing: 5px;
                    text-transform: uppercase;
                }
                .hero-description {
                    font-family: var(--font-prompt);
                    color: rgba(255,255,255,0.9);
                    margin-top: 16px;
                    max-width: 800px;
                    font-weight: 300;
                    font-size: clamp(0.85rem, 2vw, 1.2rem);
                }
                .hero-actions {
                    display: flex;
                    gap: 16px;
                    margin-top: 32px;
                    justify-content: center;
                }
                .btn-primary, .btn-secondary {
                    text-decoration: none;
                    font-family: var(--font-prompt);
                    font-weight: 700;
                    padding: 12px 32px;
                    border-radius: 4px;
                    font-size: clamp(0.85rem, 2vw, 1rem);
                    transition: all 0.2s;
                    box-shadow: 0 0 20px rgba(233, 69, 96, 0.3);
                }
                .btn-primary {
                    background-color: #E94560;
                    color: white;
                }
                .btn-primary:hover {
                    background-color: #c32f4b;
                    transform: translateY(-2px);
                }
                .btn-secondary {
                    background-color: #1A5F7A;
                    color: white;
                }
                .btn-secondary:hover {
                    background-color: #134b61;
                    transform: translateY(-2px);
                }
                .hero-footer {
                    margin-top: 48px;
                    color: white;
                }
                .hero-footer-title {
                    font-family: var(--font-prompt);
                    font-size: clamp(1.2rem, 3vw, 1.8rem);
                    font-weight: 600;
                    letter-spacing: 1px;
                }
                .hero-footer-text {
                    font-family: var(--font-prompt);
                    font-size: clamp(0.9rem, 2vw, 1.1rem);
                    opacity: 0.8;
                    margin-top: 4px;
                }
                .desktop-banner { display: block; }
                .mobile-banner { display: none; }
                .desktop-only { display: block; }

                @media (max-width: 767px) {
                    .desktop-banner { display: none; }
                    .mobile-banner { display: block; }
                    .desktop-only { display: none; }
                }
            `}</style>
        </section>
    );
}
