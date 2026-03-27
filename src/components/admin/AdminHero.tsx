import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { uploadFile } from "@/lib/storage";

const AdminHero = () => {
  const [heroTitle, setHeroTitle] = useState("ZAIRA");
  const [heroSubtitle, setHeroSubtitle] = useState("Multilingual singer-songwriter breaking boundaries between genres");
  const [heroGenres, setHeroGenres] = useState("Soul • R&B • Pop • Electronic");
  const [heroBgUrl, setHeroBgUrl] = useState("");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").in("key", [
      "hero_title",
      "hero_subtitle",
      "hero_genres",
      "hero_bg_url",
      "hero_video_url",
    ]);

    if (data) {
      data.forEach((s) => {
        if (s.key === "hero_title") setHeroTitle(s.value);
        if (s.key === "hero_subtitle") setHeroSubtitle(s.value);
        if (s.key === "hero_genres") setHeroGenres(s.value);
        if (s.key === "hero_bg_url") setHeroBgUrl(s.value);
        if (s.key === "hero_video_url") setHeroVideoUrl(s.value);
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
    await Promise.all([
      saveSetting("hero_title", heroTitle),
      saveSetting("hero_subtitle", heroSubtitle),
      saveSetting("hero_genres", heroGenres),
    ]);
    setSaving(false);
    toast({ title: "Hero settings saved!" });
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const publicUrl = await uploadFile(file, "gallery");
      await saveSetting("hero_bg_url", publicUrl);
      setHeroBgUrl(publicUrl);
      toast({ title: "Hero background updated!" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const publicUrl = await uploadFile(file, "gallery");
      await saveSetting("hero_video_url", publicUrl);
      setHeroVideoUrl(publicUrl);
      toast({ title: "Hero video updated!" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="mb-2 font-display text-3xl font-semibold text-foreground">Hero Section</h1>
        <p className="font-body text-muted-foreground">Manage the main landing section.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="font-body text-sm font-medium text-foreground">Background Image</label>
          {heroBgUrl && (
            <img
              src={heroBgUrl}
              alt="Hero background"
              className="h-48 w-full rounded-lg border border-border object-cover"
            />
          )}
          <label>
            <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" disabled={uploadingImage} />
            <Button asChild variant="outline" disabled={uploadingImage}>
              <span>
                <Upload size={16} className="mr-2" />
                {uploadingImage ? "Uploading..." : "Upload Background"}
              </span>
            </Button>
          </label>
        </div>

        <div className="space-y-3">
          <label className="font-body text-sm font-medium text-foreground">Background Video</label>
          {heroVideoUrl && (
            <video
              src={heroVideoUrl}
              className="h-48 w-full rounded-lg border border-border object-cover"
              controls
              muted
              playsInline
            />
          )}
          <label>
            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={uploadingVideo} />
            <Button asChild variant="outline" disabled={uploadingVideo}>
              <span>
                <Upload size={16} className="mr-2" />
                {uploadingVideo ? "Uploading..." : "Upload Video"}
              </span>
            </Button>
          </label>
          <p className="text-sm text-muted-foreground">If a video is uploaded, it will be shown in the hero section above the image.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-body text-sm font-medium text-foreground">Title</label>
          <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="mt-1 border-border bg-card" />
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground">Genres Line</label>
          <Input value={heroGenres} onChange={(e) => setHeroGenres(e.target.value)} className="mt-1 border-border bg-card" />
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground">Subtitle</label>
          <Input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="mt-1 border-border bg-card" />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default AdminHero;
