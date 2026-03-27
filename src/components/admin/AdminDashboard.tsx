import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Image, Music, CalendarDays, ShoppingBag, TrendingUp, MessageSquare } from "lucide-react";

interface Stats {
  subscribers: number;
  newSubscribers: number;
  galleryImages: number;
  albums: number;
  events: number;
  merchProducts: number;
  unreadMessages: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    subscribers: 0,
    newSubscribers: 0,
    galleryImages: 0,
    albums: 0,
    events: 0,
    merchProducts: 0,
    unreadMessages: 0,
  });
  const [recentSubscribers, setRecentSubscribers] = useState<{ email: string; subscribed_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [subs, newSubs, gallery, albums, events, merch, recent, unread] = await Promise.all([
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).is("unsubscribed_at", null),
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).is("unsubscribed_at", null).gte("subscribed_at", sevenDaysAgo.toISOString()),
      supabase.from("gallery_images").select("*", { count: "exact", head: true }),
      supabase.from("albums").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("merch_products").select("*", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("email, subscribed_at").is("unsubscribed_at", null).order("subscribed_at", { ascending: false }).limit(5),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    ]);

    setStats({
      subscribers: subs.count ?? 0,
      newSubscribers: newSubs.count ?? 0,
      galleryImages: gallery.count ?? 0,
      albums: albums.count ?? 0,
      events: events.count ?? 0,
      merchProducts: merch.count ?? 0,
      unreadMessages: unread.count ?? 0,
    });
    setRecentSubscribers(recent.data ?? []);
    setLoading(false);
  };

  const statCards = [
    { label: "Total Subscribers", value: stats.subscribers, icon: Users, accent: true },
    { label: "New (7 days)", value: stats.newSubscribers, icon: TrendingUp },
    { label: "Gallery Images", value: stats.galleryImages, icon: Image },
    { label: "Albums", value: stats.albums, icon: Music },
    { label: "Events", value: stats.events, icon: CalendarDays },
    { label: "Merch Products", value: stats.merchProducts, icon: ShoppingBag },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, accent: stats.unreadMessages > 0 },
  ];

  if (loading) {
    return <p className="text-muted-foreground font-body">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground font-body">Overview of your site content and subscribers.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className={card.accent ? "border-primary/30 bg-primary/5" : ""}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display font-bold text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent subscribers */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl text-foreground">Recent Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSubscribers.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No subscribers yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSubscribers.map((sub) => (
                <div key={sub.email} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <span className="font-body text-sm text-foreground">{sub.email}</span>
                  <span className="font-body text-xs text-muted-foreground">
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
