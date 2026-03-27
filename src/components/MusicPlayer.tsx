import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface Track {
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data } = await supabase
        .from("albums")
        .select("title, cover_url, audio_url")
        .neq("audio_url", "")
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setTracks(data.map(a => ({ title: a.title, artist: "Artist", cover: a.cover_url, audioUrl: a.audio_url })));
      }
    };
    fetchAlbums();
  }, []);

  // Audio element setup
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    });
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => {
      setCurrentTrack(c => (c + 1) % (tracks.length || 1));
    });

    return () => { audio.pause(); audio.src = ""; };
  }, []);

  // Listen for "show-player" custom event
  useEffect(() => {
    const handleShow = () => {
      setVisible(true);
      const audio = audioRef.current;
      if (audio && tracks.length > 0) {
        if (!audio.src || audio.src === "") {
          const track = tracks[currentTrack];
          if (track?.audioUrl) audio.src = track.audioUrl;
        }
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener("show-player", handleShow);
    return () => window.removeEventListener("show-player", handleShow);
  }, [tracks, currentTrack]);

  // Load track when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    const track = tracks[currentTrack];
    if (!track?.audioUrl) return;
    audio.src = track.audioUrl;
    if (isPlaying) audio.play().catch(() => {});
  }, [currentTrack, tracks]);

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = useCallback(() => setIsPlaying(p => !p), []);
  const nextTrack = useCallback(() => {
    setCurrentTrack(c => (c + 1) % tracks.length);
    setProgress(0);
  }, [tracks.length]);
  const prevTrack = useCallback(() => {
    setCurrentTrack(c => (c - 1 + tracks.length) % tracks.length);
    setProgress(0);
  }, [tracks.length]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width);
    audio.currentTime = pct * audio.duration;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (tracks.length === 0 || !visible) return null;

  const track = tracks[currentTrack];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in">
      <div className="absolute -top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="bg-card/95 backdrop-blur-xl border-t border-border/50">
        {/* Progress bar */}
        <div className="h-1 w-full bg-secondary cursor-pointer group" onClick={handleSeek}>
          <div
            className="h-full bg-gradient-to-r from-primary via-primary to-accent transition-all duration-150 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-2.5 flex items-center gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 w-1/3">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary flex-shrink-0 ring-1 ring-border/30">
              {track.cover ? (
                <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={16} className="text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground truncate">{track.title}</p>
              <p className="font-body text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 w-1/3">
            <button onClick={prevTrack} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Previous track">
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Next track">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Volume & time */}
          <div className="flex items-center justify-end gap-3 w-1/3">
            <span className="font-body text-xs text-muted-foreground hidden sm:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button
              onClick={() => setIsMuted(m => !m)}
              className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="w-20 hidden sm:block">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={(v) => { setVolume(v[0]); setIsMuted(v[0] === 0); }}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
