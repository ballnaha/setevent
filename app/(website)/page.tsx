"use client";

import React from "react";
import { Box } from "@mui/material";
import BannerSlider from "../components/BannerSlider";
import ClientLogos from "../components/ClientLogos";
import ServicesSection from "../components/ServicesSection";
import PortfolioGallery from "../components/PortfolioGallery";
import FeaturedEvents from "../components/FeaturedEvents";
import WhyChooseUs from "../components/WhyChooseUs";
import CTASection from "../components/CTASection";

export default function Home() {
  return (
    <Box>
      <BannerSlider />
      {/* <ClientLogos /> */}
      <ServicesSection />
      <FeaturedEvents />
      <PortfolioGallery />
      <WhyChooseUs />
      <CTASection />
    </Box>
  );
}

