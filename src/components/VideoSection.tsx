import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const VideoSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();

  return (
    <section id="video" className="section-padding bg-background" ref={ref}>
      <div className="container mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("video_label")}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-foreground">
            {t("video_title_1")} <span className="text-gold-gradient">{t("video_title_2")}</span>
          </h2>
        </div>
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/60 via-primary/20 to-primary/60 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-primary rounded-tl-sm z-10" />
            <div className="absolute -top-2 -right-2 w-10 h-10 border-t-2 border-r-2 border-primary rounded-tr-sm z-10" />
            <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-2 border-l-2 border-primary rounded-bl-sm z-10" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-primary rounded-br-sm z-10" />
            <div className="relative rounded-xl border border-primary/30 p-2 bg-card/50 backdrop-blur-sm shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-primary/10">
                <iframe
                  src="https://www.youtube.com/embed/VWb4HYtAH24?loop=1&playlist=VWb4HYtAH24,o-07rCiJyA8"
                  title="Latest Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
