import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [contactEmail, setContactEmail] = useState("contact@zairanubile.com");
  const [instagram, setInstagram] = useState("https://www.instagram.com/zairasmusic");
  const [facebook, setFacebook] = useState("https://www.facebook.com/zairasmusic");
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [merchEnabled, setMerchEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").in("key", [
      "contact_email", "instagram_url", "facebook_url", "events_section_enabled", "merch_section_enabled"
    ]);
    if (data) {
      data.forEach((s) => {
        if (s.key === "contact_email") setContactEmail(s.value);
        if (s.key === "instagram_url") setInstagram(s.value);
        if (s.key === "facebook_url") setFacebook(s.value);
        if (s.key === "events_section_enabled") setEventsEnabled(s.value !== "false");
        if (s.key === "merch_section_enabled") setMerchEnabled(s.value !== "false");
      });
    }
  };

  const saveSetting = async (key: string, value: string) => {
    // Using upsert is more reliable than manual check-then-update
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    
    if (error) throw error;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveSetting("contact_email", contactEmail),
        saveSetting("instagram_url", instagram),
        saveSetting("facebook_url", facebook),
        saveSetting("events_section_enabled", String(eventsEnabled)),
        saveSetting("merch_section_enabled", String(merchEnabled)),
      ]);
      toast({ title: "Settings saved!" });
    } catch (error: any) {
      toast({ 
        title: "Error saving settings", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground font-body">General site settings and social links.</p>
      </div>

      {/* Section Visibility */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Section Visibility</h2>
        <p className="text-sm text-muted-foreground font-body">Toggle sections on or off on the public site.</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <Label className="font-body font-medium text-foreground">Events / Tour</Label>
              <p className="text-xs text-muted-foreground font-body mt-0.5">Show the Upcoming Events section</p>
            </div>
            <Switch checked={eventsEnabled} onCheckedChange={setEventsEnabled} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <Label className="font-body font-medium text-foreground">Merch / Shop</Label>
              <p className="text-xs text-muted-foreground font-body mt-0.5">Show the Exclusive Merch section</p>
            </div>
            <Switch checked={merchEnabled} onCheckedChange={setMerchEnabled} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Contact & Social</h2>
        <div>
          <label className="font-body text-sm font-medium text-foreground">Contact Email</label>
          <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="bg-card border-border mt-1" />
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground">Instagram URL</label>
          <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="bg-card border-border mt-1" />
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground">Facebook URL</label>
          <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="bg-card border-border mt-1" />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default AdminSettings;