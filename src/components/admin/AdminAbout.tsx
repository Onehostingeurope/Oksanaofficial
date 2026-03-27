import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { uploadFile } from "@/lib/storage";

const AdminAbout = () => {
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").in("key", ["about_bio", "about_photo_url"]);
    if (data) {
      data.forEach((s) => {
        if (s.key === "about_bio") setBio(s.value);
        if (s.key === "about_photo_url") setPhotoUrl(s.value);
      });
    }
  };

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
    if (existing) {
      await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
    } else {
      await supabase.from("site_settings").insert({ key, value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await saveSetting("about_bio", bio);
    setSaving(false);
    toast({ title: "About section saved!" });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadFile(file, 'gallery');
      await saveSetting("about_photo_url", publicUrl);
      setPhotoUrl(publicUrl);
      toast({ title: "About photo updated!" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">About Section</h1>
        <p className="text-muted-foreground font-body">Edit your biography and photo.</p>
      </div>

      <div className="space-y-3">
        <label className="font-body text-sm font-medium text-foreground">Photo</label>
        {photoUrl && (
          <img src={photoUrl} alt="About photo" className="w-48 h-64 object-cover rounded-lg border border-border" />
        )}
        <label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
          <Button asChild variant="outline" disabled={uploading}>
            <span><Upload size={16} className="mr-2" />{uploading ? "Uploading..." : "Upload Photo"}</span>
          </Button>
        </label>
      </div>

      <div>
        <label className="font-body text-sm font-medium text-foreground">Biography</label>
        <p className="text-xs text-muted-foreground mb-1">Separate paragraphs with blank lines.</p>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bg-card border-border mt-1 min-h-[300px] font-body"
          placeholder="Write your biography here..."
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default AdminAbout;