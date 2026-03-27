import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminContact = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  };

  const toggleRead = async (msg: Message) => {
    await supabase.from("contact_messages").update({ is_read: !msg.is_read }).eq("id", msg.id);
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: !m.is_read } : m));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast({ title: "Message deleted" });
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) return <p className="text-muted-foreground font-body">Loading messages...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Contact Messages</h1>
        <p className="text-muted-foreground font-body">
          {messages.length} message{messages.length !== 1 ? "s" : ""} • {unreadCount} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground font-body text-sm text-center">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`cursor-pointer transition-colors ${!msg.is_read ? "border-primary/30 bg-primary/5" : ""}`}
              onClick={() => {
                setExpanded(expanded === msg.id ? null : msg.id);
                if (!msg.is_read) toggleRead(msg);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {msg.is_read ? (
                      <MailOpen size={16} className="text-muted-foreground" />
                    ) : (
                      <Mail size={16} className="text-primary" />
                    )}
                    <div>
                      <CardTitle className="font-body text-sm font-medium text-foreground">{msg.name}</CardTitle>
                      <p className="font-body text-xs text-muted-foreground">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-body text-sm font-medium text-foreground mb-1">{msg.subject}</p>
                {expanded === msg.id && (
                  <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap mt-2">{msg.message}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContact;
