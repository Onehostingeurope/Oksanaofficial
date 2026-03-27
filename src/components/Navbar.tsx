import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [merchEnabled, setMerchEnabled] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("key, value").in("key", [
          "events_section_enabled", "merch_section_enabled"
        ]);
        
        if (error) {
          console.error("Navbar: Error fetching settings:", error);
          return;
        }

        if (data) {
          data.forEach((s) => {
            if (s.key === "events_section_enabled") setEventsEnabled(s.value !== "false");
            if (s.key === "merch_section_enabled") setMerchEnabled(s.value !== "false");
          });
        }
      } catch (err) {
        console.error("Navbar: Unexpected error:", err);
      }
    };
    fetchVisibility();
  }, []);

  const allLinks = [
    { label: t("nav_about"), href: "#about", visible: true },
    { label: t("nav_music"), href: "#music", visible: true },
    { label: t("nav_gallery"), href: "#gallery", visible: true },
    { label: t("nav_events"), href: "#events", visible: eventsEnabled },
    { label: t("nav_merch"), href: "#merch", visible: merchEnabled },
    { label: t("nav_contact"), href: "#contact", visible: true },
  ];

  const navLinks = allLinks.filter((l) => l.visible);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-8">
        <a href="#" className="font-display text-3xl font-bold tracking-wider text-gold-gradient">
          ZAIRA
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-xl border-t border-border animate-fade-in">
          <div className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-lg tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;