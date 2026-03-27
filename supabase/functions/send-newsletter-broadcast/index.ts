// @ts-nocheck
import "jsr:@std/dotenv/load";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log("[newsletter-broadcast] Request received:", req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, message } = await req.json();

    if (!subject || !message) {
      console.error("[newsletter-broadcast] Validation failed: Missing subject or message");
      return new Response(JSON.stringify({ error: 'Subject and message are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Supabase Credentials (Should be auto, but fallback just in case)
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://pmerjllvanmzuzudsijp.supabase.co';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZXJqbGx2YW5ubGFsZWNvcG0wMTc4NDQ2OTM5OSwiZXhwIjIyMDkwMDIyMjkzOX0.-WhXTNd0X5o2FlFAnFAfon5YV79sM4qbi6TOpXCJXZw';
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const FROM_EMAIL = 'contact@app:zairanubile.com';

    console.log("[newsletter-broadcast] Resend API Key exists:", !!RESEND_API_KEY);

    if (!RESEND_API_KEY) {
      console.error("[newsletter-broadcast] CRITICAL: RESEND_API_KEY secret is missing");
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY secret is missing in Supabase' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch subscribers from Supabase
    console.log("[newsletter-broadcast] Fetching subscribers from Supabase...");
    const subscribersResponse = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers?select=id,email&is=unsubscribed_at.is.null`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    console.log("[newsletter-broadcast] Supabase response status:", subscribersResponse.status);

    if (!subscribersResponse.ok) {
      const errorText = await subscribersResponse.text();
      console.error("[newsletter-broadcast] Failed to fetch subscribers. Status:", subscribersResponse.status, "Body:", errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch subscribers from database',
        details: `HTTP ${subscribersResponse.status}: ${errorText}`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: subscribers } = await subscribersResponse.json();
    const emails = subscribers.map((s: any) => s.email);

    console.log(`[newsletter-broadcast] Fetched ${emails.length} subscribers`);

    if (emails.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscribers found to send to' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send via Resend API
    console.log("[newsletter-broadcast] Sending to Resend API...");
    const resendRes = await fetch('https://api.resend.com/emails/bulk', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: emails,
        subject: subject,
        html: `
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="margin-top: 20px; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">You are receiving this because you subscribed to Zaira's newsletter.</p>
          <a href="https://zairanubile.com/unsubscribe" style="color: #888; text-decoration: underline;">Unsubscribe</a>
        `,
      }),
    });

    console.log("[newsletter-broadcast] Resend response status:", resendRes.status);

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error("[newsletter-broadcast] Resend API Error:", err);
      return new Response(JSON.stringify({ 
        error: 'Failed to send emails via Resend', 
        details: err 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[newsletter-broadcast] Successfully sent to ${emails.length} subscribers`);
    
    return new Response(JSON.stringify({ message: `Sent to ${emails.length} subscribers` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("[newsletter-broadcast] Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});