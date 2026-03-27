import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Download, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, subscribed_at")
      .is("unsubscribed_at", null)
      .order("subscribed_at", { ascending: false });
    setSubscribers(data ?? []);
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    await supabase.from("newsletter_subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("id", id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Subscriber removed" });
  };

  const handleExportCSV = () => {
    const csv = ["Email,Subscribed Date", ...subscribers.map((s) => `${s.email},${new Date(s.subscribed_at).toLocaleDateString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendBroadcast = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "Please provide subject and message", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-newsletter-broadcast", {
        body: { subject, message },
      });

      if (error) {
        throw error;
      }

      // Assuming success based on no error thrown
      toast({ 
        title: "Newsletter Sent!", 
        description: `Broadcast sent to ${subscribers.length} subscribers.` 
      });
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Broadcast error:", error);
      toast({ 
        title: "Failed to send newsletter", 
        description: error.message || "Check Resend API key in Supabase secrets",
        variant: "destructive" 
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground font-body">Loading subscribers...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Broadcast Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl text-foreground">Send Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground font-body">
            Send an email to all {subscribers.length} active subscribers.
          </p>
          <div>
            <label className="font-body text-sm font-medium text-foreground">Subject</label>
            <Input 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="e.g. New Album Out Now!" 
              className="bg-card border-border mt-1" 
              disabled={sending}
            />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-foreground">Message</label>
            <Textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Write your update here..." 
              className="bg-card border-border mt-1 min-h-[150px]" 
              disabled={sending}
            />
          </div>
          <Button 
            onClick={handleSendBroadcast} 
            disabled={sending}
            className="w-full bg-primary text-primary-foreground font-body tracking-widest uppercase text-sm py-6 hover:opacity-90"
          >
            <Send size={16} />
            {sending ? "Sending..." : "Send Broadcast"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Subscribers List */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Newsletter</h1>
          <p className="text-muted-foreground font-body">{subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}</p>
        </div>
        {subscribers.length > 0 && (
          <Button variant="outline" onClick={handleExportCSV}>
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl text-foreground">Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No subscribers yet.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {subscribers.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-body text-sm text-foreground">{sub.email}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      Joined {new Date(sub.subscribed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(sub.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewsletter;