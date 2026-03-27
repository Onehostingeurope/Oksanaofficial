
ALTER TABLE public.albums ADD COLUMN deezer_url text NOT NULL DEFAULT '';
ALTER TABLE public.albums ADD COLUMN apple_music_url text NOT NULL DEFAULT '';
ALTER TABLE public.albums ADD COLUMN amazon_url text NOT NULL DEFAULT '';
ALTER TABLE public.albums ADD COLUMN youtube_url text NOT NULL DEFAULT '';
ALTER TABLE public.albums ADD COLUMN tidal_url text NOT NULL DEFAULT '';
