"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import StudioIntro from "@/components/StudioIntro";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Equipment from "@/components/Equipment";
import StudioGallery from "@/components/StudioGallery";
import Portfolio from "@/components/Portfolio";
import Packages from "@/components/Packages";
import BookingSection from "@/components/BookingSection";
import SocialSection from "@/components/SocialSection";
import FinalCTA from "@/components/FinalCTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Loading Screen Overlay */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Desktop Intelligent Cursor */}
      <CustomCursor />

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Cinematic Content */}
      <main id="main-content" className="relative min-h-screen bg-[#050505] text-[#f8fafc] overflow-x-hidden">
        {/* 01. Fullscreen Hero */}
        <Hero />

        {/* 02. Scrolling Brand Marquee */}
        <Marquee />

        {/* 03. Brand Statement */}
        <StudioIntro />

        {/* 04. Studio Experience */}
        <Experience />

        {/* 05. Editorial Services Rows */}
        <Services />

        {/* 06. Equipment Showcase */}
        <Equipment />

        {/* 07. Asymmetrical Studio Gallery */}
        <StudioGallery />

        {/* 08. Video Portfolio & Modal Player */}
        <Portfolio />

        {/* 09. Stacked Studio Packages */}
        <Packages />

        {/* 10. Live Availability & Booking Engine (Asia/Colombo) */}
        <BookingSection />

        {/* 11. Social Network */}
        <SocialSection />

        {/* 12. Final High-Impact CTA */}
        <FinalCTA />

        {/* 13. Studio Headquarters & Contact */}
        <Contact />

        {/* 14. Minimalist Flagship Footer */}
        <Footer />
      </main>
    </>
  );
}
