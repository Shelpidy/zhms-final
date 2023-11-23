"use client"
import AnimatableScroll from "@/components/AnimatableScroll";
import CustomDropDown from "@/components/CustomDropDown";
import Image from "next/image";
// import {
//   blogPageBannerItems as homeBannerItems,
// } from "@/utils/data";
import AboutSection from "@/components/AboutSection";
import ContactUs from "@/components/ContactUsSection";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import ServicesSection from "@/components/OurServices";
import DoctorsComponent from "@/components/DoctorComponent";
import DonorsComponent from "@/components/DonorComponent";
import { ServerInsertedHTMLContext } from "next/navigation";
import { useEffect, useState } from "react";
// ECEEF4

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-5 px-5">
      <Banner />
      <AnimatableScroll>
        <AboutSection imageUrl="https://picsum.photos/300/300" />
      </AnimatableScroll>
      <AnimatableScroll>
        <ServicesSection />
      </AnimatableScroll>
      <AnimatableScroll>
        <DoctorsComponent />
      </AnimatableScroll>
      <AnimatableScroll>
        <DonorsComponent />
      </AnimatableScroll>
      <AnimatableScroll>
        <ContactUs />
      </AnimatableScroll>
    </main>
  );
}
