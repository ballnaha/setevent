"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Box, Skeleton } from "@mui/material";

// Lazy load components that are below the fold for faster initial render
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";

// Lazy load components that are below the fold for faster initial render
const FeaturedEvents = dynamic(() => import("../components/FeaturedEvents"), {
    loading: () => <Box sx={{ minHeight: 500 }}><Skeleton variant="rectangular" height={500} /></Box>,
});

const PortfolioGallery = dynamic(() => import("../components/PortfolioGallery"), {
    loading: () => <Box sx={{ minHeight: 600 }}><Skeleton variant="rectangular" height={600} /></Box>,
});

const WhyChooseUs = dynamic(() => import("../components/WhyChooseUs"), {
    loading: () => <Box sx={{ minHeight: 400 }}><Skeleton variant="rectangular" height={400} /></Box>,
});

const CTASection = dynamic(() => import("../components/CTASection"), {
    loading: () => <Box sx={{ minHeight: 300 }}><Skeleton variant="rectangular" height={300} /></Box>,
});

export default function HomeContent() {
    return (
        <Box>
            <AboutSection />
            <ServicesSection />
            <FeaturedEvents />
            <PortfolioGallery />
            <WhyChooseUs />
            <CTASection />
        </Box>
    );
}

