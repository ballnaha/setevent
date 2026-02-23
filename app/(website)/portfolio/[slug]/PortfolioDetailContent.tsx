"use client";

import React, { useState } from 'react';
import { Box, Chip, Container, Typography, Button, Stack, IconButton, Modal } from '@mui/material';
import Link from 'next/link';
import { ArrowLeft, Gallery, CloseCircle, ArrowLeft2, ArrowRight2, MessageQuestion, CallCalling } from 'iconsax-react';
import Image from 'next/image';

// Swiper for Lightbox
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface PortfolioImage {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

interface Portfolio {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  images: PortfolioImage[];
}

interface PortfolioDetailContentProps {
  portfolio: Portfolio;
}

export default function PortfolioDetailContent({ portfolio }: PortfolioDetailContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const cover = portfolio.image || portfolio.images[0]?.url || '/images/placeholder.jpg';
  const albumImages = portfolio.images;
  // Include cover as first image if it's not already in the album
  const coverAlreadyInAlbum = albumImages.some(img => img.url === cover);
  const allImages = coverAlreadyInAlbum
    ? albumImages
    : [{ id: 'cover', url: cover, caption: portfolio.title, order: -1 }, ...albumImages];
  const imageCount = allImages.length;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10, overflow: 'hidden' }}>
      {/* Header Section with Geometric background */}
      <Box sx={{
        pt: { xs: 15, md: 22 },
        pb: { xs: 8, md: 10 },
        position: 'relative',
        bgcolor: 'var(--background)',
      }}>
        {/* Background Decor - Top Right */}
        <Box sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, var(--decor-emerald) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }} />
        {/* Background Decor - Bottom Left */}
        <Box sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, var(--decor-ruby) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Navigation Path */}
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
            <Button
              component={Link}
              href="/portfolio"
              startIcon={<ArrowLeft size="18" color="var(--foreground)" />}
              sx={{
                color: 'var(--foreground)',
                opacity: 0.6,
                fontFamily: 'var(--font-prompt)',
                fontSize: '0.9rem',
                textTransform: 'none',
                '&:hover': { opacity: 1, bgcolor: 'transparent' }
              }}
            >
              Portfolio
            </Button>
            <Typography sx={{ color: 'var(--foreground)', opacity: 0.3 }}>/</Typography>
            <Typography sx={{ 
              color: 'var(--primary)', 
              fontFamily: 'var(--font-prompt)', 
              fontSize: '0.9rem',
              fontWeight: 500 
            }}>
              Detail
            </Typography>
          </Stack>

          <Stack spacing={3} alignItems="center">
            {/* Category Chip */}
            <Chip
              label={portfolio.category}
              sx={{
                bgcolor: 'rgba(10, 92, 90, 0.1)',
                color: 'var(--primary)',
                border: '1px solid rgba(10, 92, 90, 0.2)',
                fontFamily: 'var(--font-prompt)',
                fontWeight: 600,
                px: 1
              }}
            />

            {/* Title with Animation-ready style */}
            <Typography
              component="h1"
              sx={{
                fontFamily: 'var(--font-prompt)',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                color: 'var(--foreground)',
                lineHeight: 1.1,
                letterSpacing: '-2px',
                textShadow: 'var(--text-glow)',
                maxWidth: 900,
                mx: 'auto'
              }}
            >
              {portfolio.title.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {i > 0 && ' '}
                  {i === portfolio.title.split(' ').length - 1 ? (
                    <span style={{
                      background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </React.Fragment>
              ))}
            </Typography>

            {/* Description with enhanced readability */}
            {portfolio.description && (
              <Typography
                sx={{
                  fontFamily: 'var(--font-prompt)',
                  color: 'var(--foreground)',
                  opacity: 0.7,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: 700,
                  lineHeight: 1.8,
                  mx: 'auto',
                  fontWeight: 300
                }}
              >
                {portfolio.description}
              </Typography>
            )}

            {/* Date Tag */}
            <Typography sx={{ 
              fontFamily: 'var(--font-prompt)', 
              fontSize: '0.85rem', 
              color: 'var(--foreground)', 
              opacity: 0.4,
              mt: 2
            }}>
              เผยแพร่เมื่อ {new Date(portfolio.createdAt).toLocaleDateString('th-TH', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Stack>
        </Container>
      </Box>


      {/* Album Gallery Section */}
      <Container maxWidth="lg">

        {imageCount === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 10, 
            bgcolor: 'rgba(128,128,128,0.05)', 
            borderRadius: 4,
            border: '1px dashed var(--border-color)'
          }}>
            <Box sx={{ opacity: 0.2, mb: 2 }}>
              <Gallery size="48" color="var(--foreground)" />
            </Box>
            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.5 }}>
              ยังไม่มีภาพเพิ่มเติมในอัลบั้มนี้
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              columnCount: { xs: 2, sm: 3, md: 4, lg: 5 },
              columnGap: '5px',
              '& > div': {
                breakInside: 'avoid',
                mb: '5px',
              },
            }}
          >
            {allImages.map((img, index) => (
              <Box
                key={img.id}
                onClick={() => openLightbox(index)}
                sx={{
                  position: 'relative',
                  borderRadius: 0,
                  overflow: 'hidden',
                  bgcolor: 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px var(--border-color)',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    zIndex: 10,
                    boxShadow: '0 12px 24px var(--border-color)',
                    '& .img-overlay': { opacity: 1 },
                    '& img': { transform: 'scale(1.05)' }
                  }
                }}
              >
                <Image
                  src={img.url}
                  alt={img.caption || portfolio.title}
                  width={800}
                  height={600}
                  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                
                {/* Hover Overlay */}
                <Box 
                  className="img-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 2
                  }}
                >
                  <Box sx={{ 
                    width: 50, height: 50, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.4)',
                    color: 'white'
                  }}>
                    <Gallery size="24" color="white" />
                  </Box>
                </Box>

                {img.caption && (
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    p: 2, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    zIndex: 3
                  }}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.85rem',
                        color: 'white',
                        fontWeight: 400,
                        lineHeight: 1.4
                      }}
                    >
                      {img.caption}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Container>

      {/* Call to Action Section (Same as Products page for consistency) */}
      <Box sx={{
          position: 'relative',
          py: { xs: 8, md: 10 },
          bgcolor: '#0a5c5a',
          background: 'linear-gradient(135deg, #0a5c5a 0%, #06403e 100%)',
          overflow: 'hidden',
          color: 'white',
          mt: 12,
          borderRadius: { xs: 0, md: '60px 60px 0 0' }
      }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)' }} />

          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                  สนใจจัดงานแบบนี้?
              </Typography>
              <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: { xs: '1rem', md: '1.25rem' }, opacity: 0.8, mb: 5, maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
                  ให้ SET EVENT ดูแลงานของคุณ ทีมงานมืออาชีพพร้อมเปลี่ยนไอเดียให้เป็นงานที่น่าจดจำ
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
                  <Button
                      href="https://line.me/ti/p/~@setevent"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      startIcon={<MessageQuestion size="24" variant="Bold" color="white" />}
                      sx={{
                          bgcolor: '#06C755',
                          color: 'white',
                          fontFamily: 'var(--font-prompt)',
                          fontWeight: 600,
                          px: 4, py: 1.8,
                          borderRadius: 3,
                          fontSize: '1rem',
                          boxShadow: '0 8px 24px rgba(6, 199, 85, 0.3)',
                          '&:hover': { bgcolor: '#05b04a', transform: 'translateY(-2px)' }
                      }}
                  >
                      แอด LINE @setevent
                  </Button>
                  <Button
                      component={Link}
                      href="/contact"
                      variant="outlined"
                      startIcon={<CallCalling size="24" variant="Bold" color="white" />}
                      sx={{
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          fontFamily: 'var(--font-prompt)',
                          fontWeight: 600,
                          px: 4, py: 1.8,
                          borderRadius: 3,
                          fontSize: '1rem',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
                      }}
                  >
                      ติดต่อสอบถามข้อมูล
                  </Button>
              </Stack>
          </Container>
      </Box>

      {/* Lightbox Modal */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          '& .MuiBackdrop-root': {
            bgcolor: 'rgba(0,0,0,0.95)'
          }
        }}
      >
        <Box sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: 1400,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          '& .lightbox-main-swiper .swiper-slide:not(.swiper-slide-active)': { visibility: 'hidden' }
        }}>
          {/* Close Button */}
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: { xs: 8, md: 16 },
              right: { xs: 8, md: 16 },
              zIndex: 100,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <CloseCircle size="28" color="white" />
          </IconButton>

          {/* Main Swiper */}
          <Box sx={{ flex: 1, position: 'relative', minHeight: 0, borderRadius: { xs: 2, md: 4 }, overflow: 'hidden' }}>
            {lightboxOpen && (
              <Swiper
                className="lightbox-main-swiper"
                key={`lightbox-${portfolio.id}-${lightboxOpen}`}
                modules={[Navigation, Thumbs, Pagination]}
                navigation={{
                  prevEl: '.lightbox-prev',
                  nextEl: '.lightbox-next',
                }}
                pagination={{ type: 'fraction', el: '.lightbox-pagination' }}
                initialSlide={lightboxIndex}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                onSlideChange={(swiper) => setLightboxIndex(swiper.realIndex)}
                style={{ width: '100%', height: '100%' }}
                slidesPerView={1}
                spaceBetween={0}
                observer={true}
                observeParents={true}
                watchSlidesProgress={true}
              >
                {allImages.map((img, idx) => (
                  <SwiperSlide 
                    key={img.id || `img-${idx}`} 
                    style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                  >
                    <Box sx={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'black'
                    }}>
                      <Image
                        src={img.url}
                        alt={img.caption || portfolio.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        priority={idx === lightboxIndex}
                        sizes="100vw"
                      />
                      
                      {img.caption && (
                        <Box sx={{ 
                          position: 'absolute', 
                          bottom: 0, left: 0, right: 0, 
                          p: 4, 
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                          textAlign: 'center',
                          zIndex: 10
                        }}>
                          <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'white', fontSize: '1.1rem' }}>
                            {img.caption}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* Navigation Arrows */}
            {imageCount > 1 && (
              <>
                <IconButton
                  className="lightbox-prev"
                  sx={{
                    position: 'absolute',
                    left: { xs: 8, md: 24 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    width: { xs: 40, md: 56 },
                    height: { xs: 40, md: 56 },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <ArrowLeft2 size="28" color="white" />
                </IconButton>
                <IconButton
                  className="lightbox-next"
                  sx={{
                    position: 'absolute',
                    right: { xs: 8, md: 24 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    width: { xs: 40, md: 56 },
                    height: { xs: 40, md: 56 },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <ArrowRight2 size="28" color="white" />
                </IconButton>
              </>
            )}
          </Box>

          {/* Footer UI */}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box className="lightbox-pagination" sx={{ color: 'white', fontFamily: 'var(--font-prompt)', fontSize: '1rem' }} />
            
            {imageCount > 1 && (
              <Box sx={{ width: '100%', height: { xs: 60, md: 80 } }}>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[FreeMode, Navigation, Thumbs]}
                  spaceBetween={12}
                  slidesPerView={'auto'}
                  freeMode={true}
                  watchSlidesProgress={true}
                  centerInsufficientSlides={true}
                  observer={true}
                  observeParents={true}
                  style={{ height: '100%' }}
                >
                  {allImages.map((img, idx) => (
                    <SwiperSlide key={idx} style={{ width: 'auto' }}>
                      <Box
                        sx={{
                          width: { xs: 80, md: 120 },
                          height: '100%',
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: idx === lightboxIndex ? '2px solid var(--primary)' : '2px solid transparent',
                          opacity: idx === lightboxIndex ? 1 : 0.4,
                          transition: 'all 0.2s',
                          '&:hover': { opacity: 1 }
                        }}
                      >
                        <Image
                          src={img.url}
                          alt="Thumbnail"
                          width={120}
                          height={80}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

