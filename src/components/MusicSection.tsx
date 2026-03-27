import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import tunemusicsLogo from "@/assets/tunemusics-logo.png";

interface AlbumDisplay {
  title: string;
  year: string;
  cover: string;
  type: string;
  spotify_url: string;
  tunemusics_url: string;
  deezer_url: string;
  apple_music_url: string;
  amazon_url: string;
  youtube_url: string;
  tidal_url: string;
}

const PLATFORMS = [
  { key: "spotify_url" as const, name: "Spotify", color: "#1DB954", icon: "https://cdn.simpleicons.org/spotify/1DB954" },
  { key: "tunemusics_url" as const, name: "TuneMusics", color: "#FF6B35", icon: tunemusicsLogo },
  { key: "apple_music_url" as const, name: "Apple Music", color: "#FA243C", icon: "https://cdn.simpleicons.org/applemusic/FA243C" },
  { key: "deezer_url" as const, name: "Deezer", color: "#A238FF", icon: "https://cdn.simpleicons.org/deezer/A238FF" },
  { key: "amazon_url" as const, name: "Amazon Music", color: "#25D1DA", icon: "https://cdn.simpleicons.org/amazonmusic/25D1DA" },
  { key: "youtube_url" as const, name: "YouTube Music", color: "#FF0000", icon: "https://cdn.simpleicons.org/youtubemusic/FF0000" },
  { key: "tidal_url" as const, name: "Tidal", color: "#000000", icon: "https://cdn.simpleicons.org/tidal/FFFFFF" },
];

const fallbackAlbums: AlbumDisplay[] = [
  { title: "Midnight Gold", year: "2025", cover: album1, type: "Album", spotify_url: "#", tunemusics_url: "", deezer_url: "", apple_music_url: "", amazon_url: "", youtube_url: "", tidal_url: "" },
  { title: "Echoes of Blue", year: "2023", cover: album2, type: "EP", spotify_url: "#", tunemusics_url: "", deezer_url: "", apple_music_url: "", amazon_url: "", youtube_url: "", tidal_url: "" },
  { title: "Silhouette", year: "2022", cover: album3, type: "Single", spotify_url: "#", tunemusics_url: "", deezer_url: "", apple_music_url: "", amazon_url: "", youtube_url: "", tidal_url: "" },
];

const MusicSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [albums, setAlbums] = useState<AlbumDisplay[]>(fallbackAlbums);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumDisplay | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("albums").select("*").order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setAlbums(data.map(a => ({
          title: a.title, year: a.year, cover: a.cover_url, type: a.type,
          spotify_url: a.spotify_url || "", tunemusics_url: a.tunemusics_url || "",
          deezer_url: a.deezer_url || "", apple_music_url: a.apple_music_url || "",
          amazon_url: a.amazon_url || "", youtube_url: a.youtube_url || "",
          tidal_url: a.tidal_url || "",
        })));
      }
    };
    fetch();
  }, []);

  const availableLinks = (album: AlbumDisplay) =>
    PLATFORMS.filter(p => album[p.key] && album[p.key] !== "#" && album[p.key].trim() !== "");

  return (
    <>
      <section id="music" className="section-padding bg-secondary/30" ref={ref}>
        <div className="container mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("music_label")}</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-foreground">
              {t("music_title_1")} <span className="text-gold-gradient">{t("music_title_2")}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album, i) => (
              <div
                key={album.title + i}
                className={`group cursor-pointer transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${(i + 1) * 200}ms` }}
                onClick={() => setSelectedAlbum(album)}
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img src={album.cover} alt={`${album.title} album cover`} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="font-body text-sm tracking-widest uppercase text-primary">LISTEN ON</span>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{album.title}</h3>
                    <p className="font-body text-sm text-muted-foreground">{album.type} • {album.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Streaming links modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedAlbum(null)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div
            className="relative bg-card border border-border rounded-2xl max-w-sm w-full p-6 animate-fade-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAlbum(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img src={selectedAlbum.cover} alt={selectedAlbum.title} className="w-20 h-20 rounded-lg object-cover ring-1 ring-border/30" />
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">{selectedAlbum.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{selectedAlbum.type} • {selectedAlbum.year}</p>
              </div>
            </div>

            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">Listen on</p>

            <div className="space-y-2">
              {availableLinks(selectedAlbum).length > 0 ? (
                availableLinks(selectedAlbum).map((platform) => (
                  <a
                    key={platform.key}
                    href={selectedAlbum[platform.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 transition-all group"
                  >
                    <img src={platform.icon} alt={platform.name} className="w-6 h-6" />
                    <span className="font-body text-sm font-medium text-foreground flex-1">{platform.name}</span>
                    <span className="font-body text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
                  </a>
                ))
              ) : (
                <p className="text-center text-muted-foreground font-body text-sm py-4">No streaming links available yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicSection;
