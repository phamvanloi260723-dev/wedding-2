"use client";

import { useEffect } from "react";
import { guest } from "@/lib/guest/guest";
import AOS from "aos";
import "aos/dist/aos.css";

import WaveSeparator from "@/components/WaveSeparator";
import DesktopSidebar from "@/components/sections/DesktopSidebar";
import HomeSection from "@/components/sections/HomeSection";
import BrideSection from "@/components/sections/BrideSection";
import QuoteSection from "@/components/sections/QuoteSection";
import LoveStorySection from "@/components/sections/LoveStorySection";
import WeddingDateSection from "@/components/sections/WeddingDateSection";
import GallerySection from "@/components/sections/GallerySection";
import LoveGiftSection from "@/components/sections/LoveGiftSection";
import CommentSection from "@/components/sections/CommentSection";
import NavbarBottom from "@/components/NavbarBottom";
import WelcomePage from "@/components/WelcomePage";
import ButtonGroup from "@/components/ButtonGroup";
import ImageModal from "@/components/ImageModal";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1200,      // tốc độ animation
      easing: "ease-in-out",
      once: true,          // chỉ chạy 1 lần (quan trọng cho vibe sang)
      offset: 80,
    });
    // Set body attributes
    // document.body.setAttribute(
    //   "data-key",
    //   "d9faced3377732b0edf19e90d1bde0cd5de04801c75eb41743",
    // );
    document.body.setAttribute("data-key", "");
    document.body.setAttribute("data-url", "/api/");
    document.body.setAttribute(
      "data-audio",
      "./assets/music/i_do-duc_phuc.mp3",
    );
    document.body.setAttribute("data-confetti", "true");
    document.body.setAttribute("data-time", "2026-02-28 09:30:00");

    // Initialize the guest module and expose to window for onclick handlers
    const app = guest.init();
    window.undangan = app;

    return () => {
      guest.destroy();
    };
  }, []);

  return (
    <>
      {/* Root Invitation */}
      <div className="row m-0 p-0 opacity-0" id="root">
        {/* Desktop mode */}
        <DesktopSidebar />

        {/* Smartphone mode */}
        <div className="col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 m-0 p-0">
          <main
            data-bs-spy="scroll"
            data-bs-target="#navbar-menu"
            data-bs-root-margin="25% 0% 0% 0%"
            data-bs-smooth-scroll="true"
            tabIndex={0}
          >
            <HomeSection />

            <WaveSeparator d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />

            <BrideSection />

            <WaveSeparator d="M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,165.3C560,160,640,128,720,128C800,128,880,160,960,186.7C1040,213,1120,235,1200,218.7C1280,203,1360,149,1400,122.7L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />

            <QuoteSection />

            <LoveStorySection />

            <WaveSeparator d="M0,96L30,106.7C60,117,120,139,180,154.7C240,171,300,181,360,186.7C420,192,480,192,540,181.3C600,171,660,149,720,154.7C780,160,840,192,900,208C960,224,1020,224,1080,208C1140,192,1200,160,1260,138.7C1320,117,1380,107,1410,101.3L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z" />

            <WeddingDateSection />

            <GallerySection />

            <WaveSeparator d="M0,96L30,106.7C60,117,120,139,180,154.7C240,171,300,181,360,186.7C420,192,480,192,540,181.3C600,171,660,149,720,154.7C780,160,840,192,900,208C960,224,1020,224,1080,208C1140,192,1200,160,1260,138.7C1320,117,1380,107,1410,101.3L1440,96L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z" />

            <LoveGiftSection />

            <CommentSection />

            <WaveSeparator d="M0,224L34.3,234.7C68.6,245,137,267,206,266.7C274.3,267,343,245,411,234.7C480,224,549,224,617,213.3C685.7,203,754,181,823,197.3C891.4,213,960,267,1029,266.7C1097.1,267,1166,213,1234,192C1302.9,171,1371,181,1406,186.7L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z" />
          </main>

          <NavbarBottom />
        </div>
      </div>

      <WelcomePage />
      <ButtonGroup />
      <ImageModal />
    </>
  );
}
