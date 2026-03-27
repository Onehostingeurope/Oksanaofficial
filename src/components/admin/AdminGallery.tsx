import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { uploadFile } from "@/lib/storage";

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  span: string;
}

const SPAN_OPTIONS = [
  { value: "col-span-1 row-span-1", label: "1×1" },
  { value: "col-span-2 row-span-1", label: "2×1 (wide)" },
  { value: "col-span-1 row-span-2", label: "1×2 (tall)" },
  { value: "col-span-2 row-span-2", label: "2×2 (large)" },
];

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order", { ascending: true });
    if (data) setImages(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const maxOrder = images.length > 0 ? Math.max(...images.map(i => i.sort_order)) : -1;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const publicUrl = await uploadFile(file, 'gallery');
        await supabase.from("gallery_images").insert({
          image_url: publicUrl,
          alt_text: file.name.replace(/\.[^/.]+$/, ""),
          sort_order: maxOrder + 1 + i,
          span: "col-span-1 row-span-1",
        });
      }
      toast({ title: "Upload complete" });
      fetchImages();
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    await supabase.from("gallery_images").delete().eq("id", image.id);
    fetchImages();
    toast({ title: "Image deleted" });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    const tempOrder = newImages[index].sort_order;
    newImages[index].sort_order = newImages[swapIndex].sort_order;
    newImages[swapIndex].sort_order = tempOrder;
    await Promise.all([
      supabase.from("gallery_images").update({ sort_order: newImages[index].sort_order }).eq("id", newImages[index].id),
      supabase.from("gallery_images").update({ sort_order: newImages[swapIndex].sort_order }).eq("id", newImages[swapIndex].id),
    ]);
    fetchImages();
  };

  const handleSpanChange = async (id: string, span: string) => {
    await supabase.from("gallery_images").update({ span }).eq("id", id);
    fetchImages();
  };

  const handleAltChange = async (id: string, alt_text: string) => {
    await supabase.from("gallery_images").update({ alt_text }).eq("id", id);
    setImages(prev => prev.map(img => img.id === id ? { ...img, alt_text } : img));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Gallery</h1>
        <p className="text-muted-foreground font-body">Upload and manage gallery images.</p>
      </div>

      <div className="border border-dashed border-border rounded-lg p-8 text-center">
        <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
        <p className="text-muted-foreground font-body mb-4">Upload images to your gallery</p>
        <label>
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          <Button asChild variant="default" disabled={uploading}>
            <span>{uploading ? "Uploading..." : "Choose Files"}</span>
          </Button>
        </label>
      </div>

      <div className="space-y-3">
        {images.map((image, index) => (
          <div key={image.id} className="flex items-center gap-4 bg-card rounded-lg p-3 border border-border">
            <GripVertical className="text-muted-foreground shrink-0" size={18} />
            <img src={image.image_url} alt={image.alt_text} className="w-24 h-16 object-cover rounded" />
            <div className="flex-1 space-y-1">
              <Input value={image.alt_text} onChange={(e) => handleAltChange(image.id, e.target.value)} placeholder="Alt text" className="bg-secondary border-border h-8 text-sm" />
              <select value={image.span} onChange={(e) => handleSpanChange(image.id, e.target.value)} className="bg-secondary border border-border rounded px-2 py-1 text-sm text-foreground">
                {SPAN_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(index, "up")} disabled={index === 0}><ArrowUp size={14} /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(index, "down")} disabled={index === images.length - 1}><ArrowDown size={14} /></Button>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(image)}><Trash2 size={16} /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;