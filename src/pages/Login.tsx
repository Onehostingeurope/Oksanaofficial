"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUserId(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "You can now sign in." });
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/admin");
      }
    }
  };

  const copyToClipboard = () => {
    if (currentUserId) {
      navigator.clipboard.writeText(currentUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "User ID copied!" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-foreground">
            {isSignUp ? "Create Account" : "Admin Login"}
          </h1>
          <p className="text-muted-foreground mt-2 font-body">
            {isSignUp ? "Sign up to get started" : "Sign in to manage your site"}
          </p>
        </div>

        {currentUserId && !isSignUp && (
          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-4 space-y-3 animate-fade-in">
            <p className="text-xs font-body text-primary uppercase tracking-widest font-bold">Logged in as:</p>
            <div className="flex items-center justify-between gap-2 bg-background/50 p-2 rounded border border-border">
              <code className="text-[10px] text-muted-foreground truncate flex-1">{currentUserId}</code>
              <button 
                onClick={copyToClipboard}
                className="text-primary hover:text-primary/80 transition-colors"
                title="Copy User ID"
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              If you can't access /admin, copy this ID and add it to the <span className="text-foreground font-medium">user_roles</span> table in Supabase with the role <span className="text-foreground font-medium">admin</span>.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs h-8"
              onClick={() => navigate("/admin")}
            >
              Try Admin Panel Again
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-card border-border"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-card border-border"
          />
          <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-body"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
          <div>
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;