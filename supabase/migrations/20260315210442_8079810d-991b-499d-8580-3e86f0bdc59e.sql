
ALTER TABLE public.albums ADD COLUMN audio_url text NOT NULL DEFAULT '';

-- Create a storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('music', 'music', true);

-- Allow anyone to read audio files
CREATE POLICY "Music files are publicly accessible" ON storage.objects FOR SELECT TO public USING (bucket_id = 'music');

-- Allow authenticated admins to upload audio files
CREATE POLICY "Admins can upload music" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'music' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Allow authenticated admins to delete audio files
CREATE POLICY "Admins can delete music" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'music' AND public.has_role(auth.uid(), 'admin'::public.app_role));
