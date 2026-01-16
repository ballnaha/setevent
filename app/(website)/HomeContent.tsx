"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Box, Skeleton } from "@mui/material";
import BannerSlider from "../components/BannerSlider";
import ServicesSection from "../components/ServicesSection";

// Lazy load below-the-fold components
const FeaturedEvents = dynamic(() => import("../components/FeaturedEvents"), {
    loading: () => <SectionSkeleton height="500px" />
});

const PortfolioGallery = dynamic(() => import("../components/PortfolioGallery"), {
    loading: () => <SectionSkeleton height="600px" />
});

const WhyChooseUs = dynamic(() => import("../components/WhyChooseUs"), {
    loading: () => <SectionSkeleton height="400px" />
});

const CTASection = dynamic(() => import("../components/CTASection"), {
    loading: () => <SectionSkeleton height="400px" />
});

// Simple skeleton for lazy loaded sections
function SectionSkeleton({ height }: { height: string }) {
    return (
        <Box sx={{
            width: '100%',
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'var(--background)'
        }}>
            <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ bgcolor: 'rgba(128, 128, 128, 0.1)' }}
            />
        </Box>
    );
}

export default function HomeContent() {
    return (
        <Box>
            {/* Critical above-the-fold content - loaded immediately */}
            <BannerSlider />
            <ServicesSection />

            {/* Below-the-fold content - lazy loaded */}
            <FeaturedEvents />
            <PortfolioGallery />
            <WhyChooseUs />
            <CTASection />
        </Box>
    );
}
