import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import aboutPhotoFallback from "@/assets/about-photo.jpg";

const defaultBio = [
  "Zaira Nubile is a multilingual singer-songwriter born and raised in Italy. She began studying singing and the arts at the age of seven, developing an eclectic and explosive artistic personality. With a seemingly endless energy for creation, music has always been the center of her world.",
  "At 19, Zaira moved to Los Angeles to begin her professional journey as a songwriter, collaborating with various producers. Since 2010, she has been independently writing and producing her own music.",
  "Gifted with a highly versatile voice, her creativity flows through soul, pop, funk, jazz, and R&B, while embracing modern electronic sounds that often emerge in powerful moments of inspiration during her live performances.",
  "Working with many talented musicians over the years, she has collaborated with numerous bands and experimented with a wide range of musical styles. These influences are reflected in her musical projects, which she creates in Italian, English, and Spanish.",
  "Zaira is currently working on her first studio album, using her vocal versatility to break down the boundaries between musical genres.",
];

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [photoUrl, setPhotoUrl] = useState(aboutPhotoFallback);
  const [paragraphs, setParagraphs] = useState(defaultBio);
  const { t } = useLanguage();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", ["about_bio", "about_photo_url"]);
      if (data) {
        data.forEach((s) => {
          if (s.key === "about_photo_url" && s.value) setPhotoUrl(s.value);
          if (s.key === "about_bio" && s.value) setParagraphs(s.value.split("\n\n").filter(Boolean));
        });
      }
    };
    fetch();
  }, []);

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-lg blur-xl" />
              <img src={photoUrl} alt="ZAIRA portrait" className="relative w-full rounded-lg object-cover aspect-[3/4] shadow-2xl" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent rounded-b-lg" />
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("about_label")}</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-foreground mb-6">
              {t("about_title_1")}<br />
              <span className="text-gold-gradient">{t("about_title_2")}</span>
            </h2>
            <div className="space-y-4 text-foreground/60 font-body leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
