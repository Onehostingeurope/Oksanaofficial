import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const fallbackImages = [
  { src: gallery2, alt: "ZAIRA backstage", span: "col-span-2 row-span-1" },
  { src: gallery1, alt: "ZAIRA live performance", span: "col-span-1 row-span-2" },
  { src: gallery3, alt: "ZAIRA music video", span: "col-span-1 row-span-1" },
  { src: gallery4, alt: "ZAIRA festival", span: "col-span-2 row-span-1" },
  { src: gallery5, alt: "ZAIRA studio", span: "col-span-1 row-span-1" },
  { src: gallery6, alt: "ZAIRA editorial", span: "col-span-1 row-span-1" },
];

interface GalleryImage {
  src: string;
  alt: string;
  span: string;
}

const GallerySection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>(fallbackImages);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (data && data.length > 0) {
        setImages(data.map(img => ({
          src: img.image_url,
          alt: img.alt_text,
          span: img.span,
        })));
      }
    };
    fetchImages();
  }, []);

  return (
    <section id="gallery" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("gallery_label")}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-foreground">
            {t("gallery_title_1")} <span className="text-gold-gradient">{t("gallery_title_2")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] sm:auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`${img.span.includes('col-span-2') ? 'sm:col-span-2' : ''} ${img.span.includes('row-span-2') ? 'md:row-span-2' : ''} relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-700 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onClick={() => setLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-slow"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-foreground/60 hover:text-foreground transition-colors"
            onClick={() => setLightbox(null)}
            aria-label={t("gallery_close")}
          >
            <X size={32} />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
