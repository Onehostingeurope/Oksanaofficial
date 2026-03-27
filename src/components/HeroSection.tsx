import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBgFallback from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [title, setTitle] = useState("ZAIRA");
  const [subtitle, setSubtitle] = useState("Multilingual singer-songwriter breaking boundaries between genres");
  const [genres, setGenres] = useState("Soul • R&B • Pop • Electronic");
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", [
        "hero_title",
        "hero_subtitle",
        "hero_genres",
        "hero_bg_url",
        "hero_video_url",
      ]);

      let foundBg = false;
      if (data) {
        data.forEach((s) => {
          if (s.key === "hero_title" && s.value) setTitle(s.value);
          if (s.key === "hero_subtitle" && s.value) setSubtitle(s.value);
          if (s.key === "hero_genres" && s.value) setGenres(s.value);
          if (s.key === "hero_bg_url" && s.value) {
            setBgUrl(s.value);
            foundBg = true;
          }
          if (s.key === "hero_video_url" && s.value) setVideoUrl(s.value);
        });
      }

      if (!foundBg) setBgUrl(heroBgFallback);
      setLoaded(true);
    };

    fetchSettings();
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            poster={bgUrl ?? heroBgFallback}
            className={`h-full w-full object-cover object-center transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          bgUrl && (
            <img
              src={bgUrl}
              alt="ZAIRA performing on stage"
              className={`h-full w-full object-cover object-top transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              loading="eager"
            />
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/40" />
      </div>
      <div className="relative z-10 mt-16 px-4 text-center sm:mt-20">
        <p
          className="mb-3 animate-fade-in font-body text-xs uppercase tracking-[0.3em] text-primary/80 opacity-0 sm:mb-4 sm:text-sm sm:tracking-[0.4em] md:text-base"
          style={{ animationDelay: "0.3s" }}
        >
          {genres}
        </p>
        <h1
          className="mb-4 font-display text-5xl font-bold leading-none tracking-wider text-gold-gradient opacity-0 animate-fade-in sm:mb-6 sm:text-7xl md:text-9xl lg:text-[12rem]"
          style={{ animationDelay: "0.5s" }}
        >
          {title}
        </h1>
        <p
          className="mx-auto mb-8 max-w-xs animate-fade-in font-body text-base text-foreground/60 opacity-0 sm:mb-10 sm:max-w-md sm:text-lg md:text-xl"
          style={{ animationDelay: "0.8s" }}
        >
          {subtitle}
        </p>
        <div
          className="flex animate-fade-in flex-col items-center justify-center gap-3 opacity-0 sm:flex-row sm:gap-4"
          style={{ animationDelay: "1.1s" }}
        >
          <Button
            size="lg"
            className="w-full bg-gold-gradient px-8 py-6 font-body text-sm uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            onClick={() => window.dispatchEvent(new CustomEvent("show-player"))}
          >
            <Play size={16} />
            {t("hero_listen")}
          </Button>
          <a href="#contact">
            <Button variant="outline" size="lg" className="w-full border-primary/40 px-8 py-6 font-body text-sm uppercase tracking-widest text-primary hover:bg-primary/10 sm:w-auto">
              CONTACT
            </Button>
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in opacity-0" style={{ animationDelay: "1.5s" }}>
        <div className="mx-auto h-16 w-px bg-gradient-to-b from-primary/60 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
