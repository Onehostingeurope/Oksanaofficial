import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface Event {
  id: string;
  date: string;
  year: string;
  venue: string;
  city: string;
  sold_out: boolean;
  sort_order: number;
}

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("sort_order", { ascending: true });
    if (data) setEvents(data);
  };

  const handleAdd = async () => {
    const maxOrder = events.length > 0 ? Math.max(...events.map(e => e.sort_order)) : -1;
    await supabase.from("events").insert({ date: "JAN 01", year: new Date().getFullYear().toString(), venue: "New Venue", city: "City, Country", sold_out: false, sort_order: maxOrder + 1 });
    fetchEvents();
  };

  const handleUpdate = async (id: string, field: string, value: string | boolean) => {
    await supabase.from("events").update({ [field]: value }).eq("id", id);
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
    toast({ title: "Event deleted" });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Events</h1>
          <p className="text-muted-foreground font-body">Manage your tour dates.</p>
        </div>
        <Button onClick={handleAdd}><Plus size={16} className="mr-2" />Add Event</Button>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-card rounded-lg p-4 border border-border">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
              <Input value={event.date} onChange={(e) => handleUpdate(event.id, "date", e.target.value)} placeholder="e.g. APR 12" className="bg-secondary border-border h-9 text-sm" />
              <Input value={event.year} onChange={(e) => handleUpdate(event.id, "year", e.target.value)} placeholder="Year" className="bg-secondary border-border h-9 text-sm" />
              <Input value={event.venue} onChange={(e) => handleUpdate(event.id, "venue", e.target.value)} placeholder="Venue" className="bg-secondary border-border h-9 text-sm" />
              <Input value={event.city} onChange={(e) => handleUpdate(event.id, "city", e.target.value)} placeholder="City, Country" className="bg-secondary border-border h-9 text-sm" />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={event.sold_out} onChange={(e) => handleUpdate(event.id, "sold_out", e.target.checked)} className="rounded border-border" />
                  Sold Out
                </label>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive ml-auto" onClick={() => handleDelete(event.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-center text-muted-foreground font-body py-8">No events yet. Add one above!</p>}
      </div>
    </div>
  );
};

export default AdminEvents;
