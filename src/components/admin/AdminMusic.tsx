import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload, Music, ChevronDown, ChevronUp } from "lucide-react";
import { uploadFile } from "@/lib/storage";

interface Album {
  id: string;
  title: string;
  year: string;
  type: string;
  cover_url: string;
  spotify_url: string;
  audio_url: string;
  tunemusics_url: string;
  deezer_url: string;
  apple_music_url: string;
  amazon_url: string;
  youtube_url: string;
  tidal_url: string;
  sort_order: number;
}

const PLATFORM_FIELDS = [
  { key: "spotify_url", label: "Spotify URL", placeholder: "https://open.spotify.com/..." },
  { key: "tunemusics_url", label: "TuneMusics URL", placeholder: "https://tunemusics.com/..." },
  { key: "apple_music_url", label: "Apple Music URL", placeholder: "https://music.apple.com/..." },
  { key: "deezer_url", label: "Deezer URL", placeholder: "https://www.deezer.com/..." },
  { key: "amazon_url", label: "Amazon Music URL", placeholder: "https://music.amazon.com/..." },
  { key: "youtube_url", label: "YouTube Music URL", placeholder: "https://music.youtube.com/..." },
  { key: "tidal_url", label: "Tidal URL", placeholder: "https://tidal.com/..." },
] as const;

const AdminMusic = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState<string | null>(null);
  const [expandedLinks, setExpandedLinks] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    const { data } = await supabase.from("albums").select("*").order("sort_order", { ascending: true });
    if (data) setAlbums(data);
  };

  const handleAdd = async () => {
    const maxOrder = albums.length > 0 ? Math.max(...albums.map(a => a.sort_order)) : -1;
    await supabase.from("albums").insert({ title: "New Album", year: new Date().getFullYear().toString(), type: "Album", cover_url: "", spotify_url: "", audio_url: "", sort_order: maxOrder + 1 });
    fetchAlbums();
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    await supabase.from("albums").update({ [field]: value }).eq("id", id);
    setAlbums(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("albums").delete().eq("id", id);
    fetchAlbums();
    toast({ title: "Album deleted" });
  };

  const handleCoverUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(id);
    try {
      const publicUrl = await uploadFile(file, 'gallery');
      await supabase.from("albums").update({ cover_url: publicUrl }).eq("id", id);
      setAlbums(prev => prev.map(a => a.id === id ? { ...a, cover_url: publicUrl } : a));
      toast({ title: "Cover uploaded!" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const handleAudioUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAudio(id);
    try {
      const publicUrl = await uploadFile(file, 'music');
      await supabase.from("albums").update({ audio_url: publicUrl }).eq("id", id);
      setAlbums(prev => prev.map(a => a.id === id ? { ...a, audio_url: publicUrl } : a));
      toast({ title: "Song uploaded!" });
    } catch (error: any) {
      toast({ title: "Music upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingAudio(null);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Music</h1>
          <p className="text-muted-foreground font-body">Manage your discography.</p>
        </div>
        <Button onClick={handleAdd}><Plus size={16} className="mr-2" />Add Album</Button>
      </div>

      <div className="space-y-4">
        {albums.map((album) => (
          <div key={album.id} className="bg-card rounded-lg p-4 border border-border space-y-3">
            <div className="flex gap-4">
              <div className="shrink-0">
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.title} className="w-24 h-24 object-cover rounded" />
                ) : (
                  <div className="w-24 h-24 bg-secondary rounded flex items-center justify-center text-muted-foreground"><Upload size={20} /></div>
                )}
                <label className="mt-1 block">
                  <input type="file" accept="image/*" onChange={(e) => handleCoverUpload(album.id, e)} className="hidden" />
                  <span className="text-xs text-primary cursor-pointer hover:underline font-body">{uploading === album.id ? "Uploading..." : "Change cover"}</span>
                </label>
              </div>
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input value={album.title} onChange={(e) => handleUpdate(album.id, "title", e.target.value)} placeholder="Title" className="bg-secondary border-border h-9 text-sm" />
                  <Input value={album.year} onChange={(e) => handleUpdate(album.id, "year", e.target.value)} placeholder="Year" className="bg-secondary border-border h-9 text-sm" />
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 rounded p-2">
                  <Music size={16} className="text-muted-foreground shrink-0" />
                  {album.audio_url ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <audio src={album.audio_url} controls className="h-8 flex-1 min-w-0" />
                      <label className="shrink-0">
                        <input type="file" accept="audio/*" onChange={(e) => handleAudioUpload(album.id, e)} className="hidden" />
                        <span className="text-xs text-primary cursor-pointer hover:underline font-body">{uploadingAudio === album.id ? "Uploading..." : "Replace"}</span>
                      </label>
                    </div>
                  ) : (
                    <label className="flex-1 cursor-pointer">
                      <input type="file" accept="audio/*" onChange={(e) => handleAudioUpload(album.id, e)} className="hidden" />
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">{uploadingAudio === album.id ? "Uploading..." : "Upload audio file"}</span>
                    </label>
                  )}
                </div>
                <button onClick={() => setExpandedLinks(expandedLinks === album.id ? null : album.id)} className="flex items-center gap-1 text-xs text-primary hover:underline font-body">
                  {expandedLinks === album.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Streaming Platform Links
                </button>
                {expandedLinks === album.id && (
                  <div className="grid grid-cols-1 gap-2 pl-1 border-l-2 border-primary/20 ml-1">
                    {PLATFORM_FIELDS.map((p) => (
                      <Input key={p.key} value={(album as any)[p.key] || ""} onChange={(e) => handleUpdate(album.id, p.key, e.target.value)} placeholder={p.placeholder} className="bg-secondary border-border h-8 text-xs" />
                    ))}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive shrink-0" onClick={() => handleDelete(album.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMusic;