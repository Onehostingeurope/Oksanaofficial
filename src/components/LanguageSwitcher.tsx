import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage, languageFlags, languageLabels, type Language } from "@/contexts/LanguageContext";

const languages: Language[] = ["en", "fr", "it", "es", "de", "ru"];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/50 bg-card/50 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-300 text-sm"
        aria-label="Change language"
      >
        <Globe size={14} className="text-primary" />
        <img src={languageFlags[language]} alt={languageLabels[language]} className="w-5 h-3.5 rounded-[2px] object-cover" />
        <span className="font-body text-xs tracking-wider">{languageLabels[language]}</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-xl overflow-hidden animate-fade-in min-w-[120px] z-50">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body tracking-wider transition-colors ${
                language === lang
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              }`}
            >
              <img src={languageFlags[lang]} alt={languageLabels[lang]} className="w-5 h-3.5 rounded-[2px] object-cover" />
              <span>{languageLabels[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
