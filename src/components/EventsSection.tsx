import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const fallbackEvents = [
  { date: "APR 12", year: "2026", venue: "Madison Square Garden", city: "New York, USA", soldOut: false },
  { date: "APR 28", year: "2026", venue: "The O2 Arena", city: "London, UK", soldOut: false },
  { date: "MAY 15", year: "2026", venue: "Palau Sant Jordi", city: "Barcelona, Spain", soldOut: true },
  { date: "JUN 03", year: "2026", venue: "Tokyo Dome", city: "Tokyo, Japan", soldOut: false },
  { date: "JUN 20", year: "2026", venue: "Allianz Parque", city: "São Paulo, Brazil", soldOut: false },
];

interface EventDisplay {
  date: string;
  year: string;
  venue: string;
  city: string;
  soldOut: boolean;
}

const EventsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [events, setEvents] = useState<EventDisplay[]>(fallbackEvents);
  const { t } = useLanguage();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("events").select("*").order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setEvents(data.map(e => ({ date: e.date, year: e.year, venue: e.venue, city: e.city, soldOut: e.sold_out })));
      }
    };
    fetch();
  }, []);

  return (
    <section id="events" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("events_label")}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-foreground">
            {t("events_title_1")} <span className="text-gold-gradient">{t("events_title_2")}</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {events.map((event, i) => (
            <div key={i} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-lg border border-border bg-card/50 hover:border-primary/30 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${(i + 1) * 150}ms` }}>
              <div className="flex items-center gap-6">
                <div className="text-center min-w-[70px]">
                  <p className="font-display text-2xl font-bold text-primary">{event.date}</p>
                  <p className="font-body text-xs text-muted-foreground">{event.year}</p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{event.venue}</h3>
                  <p className="font-body text-sm text-muted-foreground flex items-center gap-1"><MapPin size={12} /> {event.city}</p>
                </div>
              </div>
              {event.soldOut ? (
                <span className="font-body text-xs tracking-widest uppercase text-muted-foreground border border-border px-4 py-2 rounded">{t("events_sold_out")}</span>
              ) : (
                <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 font-body tracking-widest uppercase text-xs">
                  <Calendar size={14} />{t("events_tickets")}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
