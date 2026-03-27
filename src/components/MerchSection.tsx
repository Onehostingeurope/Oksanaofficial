import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import merch1 from "@/assets/merch-1.jpg";
import merch2 from "@/assets/merch-2.jpg";
import merch3 from "@/assets/merch-3.jpg";

const fallbackProducts = [
  { name: "Crown Logo Tee", price: "$45", image: merch1, url: "#" },
  { name: "Limited Vinyl", price: "$35", image: merch2, url: "#" },
  { name: "Tour Poster", price: "$25", image: merch3, url: "#" },
];

interface ProductDisplay {
  name: string;
  price: string;
  image: string;
  url: string;
}

const MerchSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [products, setProducts] = useState<ProductDisplay[]>(fallbackProducts);
  const { t } = useLanguage();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("merch_products").select("*").order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setProducts(data.map(p => ({ name: p.name, price: p.price, image: p.image_url, url: p.shop_url || "#" })));
      }
    };
    fetch();
  }, []);

  return (
    <section id="merch" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("merch_label")}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-foreground">
            {t("merch_title_1")} <span className="text-gold-gradient">{t("merch_title_2")}</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {products.map((product, i) => (
            <div key={product.name + i} className={`group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: `${(i + 1) * 200}ms` }}>
              <div className="relative overflow-hidden rounded-lg mb-4 bg-card">
                <img src={product.image} alt={product.name} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
                  <p className="font-body text-sm text-primary">{product.price}</p>
                </div>
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10" aria-label={`Buy ${product.name}`}>
                    <ShoppingBag size={16} />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchSection;
