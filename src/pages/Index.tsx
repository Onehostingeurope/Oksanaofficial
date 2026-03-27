import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MusicSection from "@/components/MusicSection";
import VideoSection from "@/components/VideoSection";
import GallerySection from "@/components/GallerySection";
import EventsSection from "@/components/EventsSection";
import MerchSection from "@/components/MerchSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [merchEnabled, setMerchEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("key, value").in("key", [
          "events_section_enabled", "merch_section_enabled"
        ]);
        
        if (error) {
          console.error("Error fetching site settings:", error);
          return;
        }

        if (data) {
          data.forEach((s) => {
            if (s.key === "events_section_enabled") setEventsEnabled(s.value !== "false");
            if (s.key === "merch_section_enabled") setMerchEnabled(s.value !== "false");
          });
        }
      } catch (err) {
        console.error("Unexpected error fetching settings:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchVisibility();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MusicSection />
      <VideoSection />
      <GallerySection />
      {eventsEnabled && <EventsSection />}
      {merchEnabled && <MerchSection />}
      <ContactSection />
      <Footer eventsEnabled={eventsEnabled} merchEnabled={merchEnabled} />
      <MusicPlayer />
    </div>
  );
};

export default Index;