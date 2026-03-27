import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = ({ eventsEnabled = true, merchEnabled = true }: { eventsEnabled?: boolean; merchEnabled?: boolean }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const allLinks = [
    { key: "nav_about", href: "about", visible: true },
    { key: "nav_music", href: "music", visible: true },
    { key: "nav_gallery", href: "gallery", visible: true },
    { key: "nav_events", href: "events", visible: eventsEnabled },
    { key: "nav_merch", href: "merch", visible: merchEnabled },
    { key: "nav_contact", href: "contact", visible: true },
  ];
  const visibleLinks = allLinks.filter(l => l.visible);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: t("contact_valid_email"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: trimmed });
    setSubmitting(false);
    if (error?.code === "23505") {
      toast({ title: t("footer_already_subscribed") });
    } else if (error) {
      toast({ title: t("contact_error"), variant: "destructive" });
    } else {
      toast({ title: t("footer_subscribed") });
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-12">
          <div>
            <h3 className="font-display text-3xl font-bold text-gold-gradient mb-4">ZAIRA</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {t("footer_tagline")}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-body text-sm tracking-widest uppercase text-primary mb-2">{t("footer_quick_links")}</p>
            {visibleLinks.map((link) => (
              <a
                key={link.key}
                href={`#${link.href}`}
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(link.key as any)}
              </a>
            ))}
          </div>

          <div>
            <p className="font-body text-sm tracking-widest uppercase text-primary mb-4">{t("footer_newsletter")}</p>
            <p className="font-body text-sm text-muted-foreground mb-4">{t("footer_newsletter_desc")}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={t("footer_email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border font-body text-sm"
                disabled={submitting}
              />
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gold-gradient text-primary-foreground font-body text-sm hover:opacity-90 shrink-0"
              >
                {submitting ? "..." : t("footer_join")}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 ZAIRA. All rights reserved. Design by{" "}
            <a 
              href="https://onehostingeurope.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              OneHostingEurope
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
