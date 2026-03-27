import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [contactEmail, setContactEmail] = useState("contact@zairanubile.com");
  const [instagram, setInstagram] = useState("https://www.instagram.com/zairasmusic");
  const [facebook, setFacebook] = useState("https://www.facebook.com/zairasmusic");
  const { t } = useLanguage();

  // Keep fetch but fallback overrides if not found in DB
  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", [
        "contact_email", "instagram_url", "facebook_url"
      ]);
      if (data) {
        data.forEach((s) => {
          if (s.key === "contact_email" && s.value) setContactEmail(s.value);
          if (s.key === "instagram_url" && s.value) setInstagram(s.value);
          if (s.key === "facebook_url" && s.value) setFacebook(s.value);
        });
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      toast({ title: t("contact_fill_all"), variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast({ title: t("contact_valid_email"), variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    if (error) {
      setSubmitting(false);
      toast({ title: t("contact_error"), variant: "destructive" });
      return;
    }

    // Send email notification via edge function (fire and forget)
    supabase.functions.invoke("send-contact-email", {
      body: {
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      },
    }).catch((err) => console.error("Email notification failed:", err));

    setSubmitting(false);
    toast({ title: t("contact_sent"), description: t("contact_sent_desc") });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("contact_label")}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-foreground">
            {t("contact_title_1")} <span className="text-gold-gradient">{t("contact_title_2")}</span>
          </h2>
        </div>

        <div className={`grid md:grid-cols-2 gap-12 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">{t("contact_booking_title")}</h3>
              <p className="font-body text-muted-foreground">{t("contact_booking_desc")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-body text-sm text-muted-foreground">Management</p>
                <p className="font-body text-foreground">contact@zairanubile.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors border border-border px-3 py-2 rounded"
              >
                Instagram
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors border border-border px-3 py-2 rounded"
              >
                Facebook
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t("contact_name")}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-card border-border font-body"
              required
              disabled={submitting}
            />
            <Input
              type="email"
              placeholder={t("contact_email")}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-card border-border font-body"
              required
              disabled={submitting}
            />
            <Input
              placeholder={t("contact_subject")}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-card border-border font-body"
              required
              disabled={submitting}
            />
            <Textarea
              placeholder={t("contact_message")}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-card border-border font-body min-h-[120px]"
              required
              disabled={submitting}
            />
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-gradient text-primary-foreground font-body tracking-widest uppercase text-sm py-6 hover:opacity-90"
            >
              <Send size={16} />
              {submitting ? t("contact_sending") : t("contact_send")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;