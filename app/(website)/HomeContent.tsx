"use client";

import React from "react";
import { Box } from "@mui/material";
import ServicesSection from "../components/ServicesSection";
import PortfolioGallery from "../components/PortfolioGallery";
import FeaturedEvents from "../components/FeaturedEvents";
import WhyChooseUs from "../components/WhyChooseUs";
import CTASection from "../components/CTASection";

export default function HomeContent() {
    return (
        <Box>
            <ServicesSection />
            <FeaturedEvents />
            <PortfolioGallery />
            <WhyChooseUs />
            <CTASection />
        </Box>
    );
}
