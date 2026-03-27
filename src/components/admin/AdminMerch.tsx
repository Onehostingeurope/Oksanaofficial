import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload } from "lucide-react";
import { uploadFile } from "@/lib/storage";

interface MerchProduct {
  id: string;
  name: string;
  price: string;
  image_url: string;
  shop_url: string;
  sort_order: number;
}

const AdminMerch = () => {
  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("merch_products").select("*").order("sort_order", { ascending: true });
    if (data) setProducts(data);
  };

  const handleAdd = async () => {
    const maxOrder = products.length > 0 ? Math.max(...products.map(p => p.sort_order)) : -1;
    await supabase.from("merch_products").insert({ name: "New Product", price: "$0", image_url: "", shop_url: "", sort_order: maxOrder + 1 });
    fetchProducts();
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    await supabase.from("merch_products").update({ [field]: value }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("merch_products").delete().eq("id", id);
    fetchProducts();
    toast({ title: "Product deleted" });
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(id);
    try {
      const publicUrl = await uploadFile(file, 'gallery');
      await supabase.from("merch_products").update({ image_url: publicUrl }).eq("id", id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, image_url: publicUrl } : p));
      toast({ title: "Image uploaded!" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Merch</h1>
          <p className="text-muted-foreground font-body">Manage your merchandise.</p>
        </div>
        <Button onClick={handleAdd}><Plus size={16} className="mr-2" />Add Product</Button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex gap-4">
              <div className="shrink-0">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded" />
                ) : (
                  <div className="w-24 h-24 bg-secondary rounded flex items-center justify-center text-muted-foreground"><Upload size={20} /></div>
                )}
                <label className="mt-1 block">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(product.id, e)} className="hidden" />
                  <span className="text-xs text-primary cursor-pointer hover:underline font-body">{uploading === product.id ? "Uploading..." : "Change image"}</span>
                </label>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input value={product.name} onChange={(e) => handleUpdate(product.id, "name", e.target.value)} placeholder="Product name" className="bg-secondary border-border h-9 text-sm" />
                <Input value={product.price} onChange={(e) => handleUpdate(product.id, "price", e.target.value)} placeholder="$0" className="bg-secondary border-border h-9 text-sm" />
                <Input value={product.shop_url} onChange={(e) => handleUpdate(product.id, "shop_url", e.target.value)} placeholder="Shop URL" className="bg-secondary border-border h-9 text-sm col-span-2" />
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive shrink-0" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMerch;