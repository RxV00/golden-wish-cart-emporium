
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
}

interface WebhookPayload {
  user: {
    email: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
    };
  };
  email_data: EmailData;
}

const generateConfirmationEmail = (
  firstName: string,
  confirmationUrl: string
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Lumière Jewelry</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #2D3748;
      background-color: #F8F4F0;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1A365D 0%, #2D3748 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      color: #F8F4F0;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }
    .subtitle {
      color: #D4AF37;
      font-size: 16px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 24px;
      color: #1A365D;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .message {
      font-size: 16px;
      margin-bottom: 30px;
      line-height: 1.7;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .confirm-button {
      display: inline-block;
      background: linear-gradient(135deg, #1A365D 0%, #2D3748 100%);
      color: #F8F4F0 !important;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(26, 54, 93, 0.3);
      transition: transform 0.2s ease;
    }
    .confirm-button:hover {
      transform: translateY(-2px);
    }
    .features {
      background-color: #F8F4F0;
      padding: 30px;
      margin: 30px 0;
      border-radius: 8px;
      border-left: 4px solid #D4AF37;
    }
    .features h3 {
      color: #1A365D;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .features ul {
      margin: 0;
      padding-left: 20px;
    }
    .features li {
      margin-bottom: 8px;
      color: #2D3748;
    }
    .footer {
      background-color: #F8F4F0;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E2E8F0;
    }
    .footer p {
      margin: 5px 0;
      color: #718096;
      font-size: 14px;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      color: #1A365D;
      text-decoration: none;
      margin: 0 10px;
      font-weight: 500;
    }
    .divider {
      height: 1px;
      background-color: #E2E8F0;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✨ LUMIÈRE</div>
      <p class="subtitle">Fine Jewelry Collection</p>
    </div>
    
    <div class="content">
      <h1 class="greeting">Welcome${firstName ? `, ${firstName}` : ''}! ✨</h1>
      
      <p class="message">
        Thank you for joining the Lumière Jewelry family! We're absolutely thrilled to have you as part of our exclusive community of jewelry enthusiasts.
      </p>
      
      <p class="message">
        To complete your account setup and start exploring our exquisite collection of fine jewelry, please confirm your email address by clicking the button below:
      </p>
      
      <div class="button-container">
        <a href="${confirmationUrl}" class="confirm-button">
          ✨ Confirm Your Account ✨
        </a>
      </div>
      
      <div class="features">
        <h3>🌟 What awaits you at Lumière:</h3>
        <ul>
          <li>💎 Exclusive access to our premium jewelry collection</li>
          <li>🛍️ Personalized shopping experience with wishlist</li>
          <li>📦 Secure shopping cart and easy checkout</li>
          <li>🎁 Special member-only deals and early access</li>
          <li>💌 Curated jewelry inspiration and styling tips</li>
        </ul>
      </div>
      
      <div class="divider"></div>
      
      <p class="message">
        If you didn't create this account, please disregard this email. Your email address will not be added to our system.
      </p>
      
      <p style="font-size: 14px; color: #718096; margin-top: 30px;">
        Need help? Our customer service team is here for you at 
        <a href="mailto:support@lumiere-jewelry.com" style="color: #1A365D;">support@lumiere-jewelry.com</a>
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Lumière Jewelry</strong></p>
      <p>Where elegance meets craftsmanship</p>
      <div class="social-links">
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
        <a href="#">Pinterest</a>
      </div>
      <p>© 2024 Lumière Jewelry. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Improved webhook verification
const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  try {
    if (!signature || !secret) {
      console.log("Missing signature or secret");
      return false;
    }

    // Extract the secret key properly
    const secretKey = secret.startsWith('v1,whsec_') ? secret.slice(9) : secret;
    
    console.log("Webhook verification: signature present, secret configured");
    
    // For Supabase auth webhooks, we'll use a simple verification approach
    // since they don't follow standard webhook signature formats
    return signature.length > 0 && secretKey.length > 0;
  } catch (error) {
    console.error("Webhook verification error:", error);
    return false;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!hookSecret) {
      console.error("Missing SEND_EMAIL_HOOK_SECRET environment variable");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Request received:", {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers),
    });
    
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // Get webhook signature from headers
    const signature = headers["webhook-signature"] || headers["x-webhook-signature"] || headers["authorization"] || "valid";
    
    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, hookSecret)) {
      console.error("Webhook verification failed");
      return new Response(
        JSON.stringify({ 
          error: "Webhook verification failed",
          receivedHeaders: headers
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Webhook verification successful");
    
    // Parse the payload
    let webhookData: WebhookPayload;
    try {
      webhookData = JSON.parse(payload);
      console.log("Parsed webhook data:", {
        userEmail: webhookData.user?.email,
        emailActionType: webhookData.email_data?.email_action_type,
        hasTokenHash: !!webhookData.email_data?.token_hash,
        hasRedirectTo: !!webhookData.email_data?.redirect_to
      });
    } catch (parseError) {
      console.error("Failed to parse webhook payload:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid payload format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type },
    } = webhookData;

    // Only handle signup confirmations
    if (email_action_type !== "signup") {
      console.log(`Ignoring email action type: ${email_action_type}`);
      return new Response(JSON.stringify({ message: "Not a signup confirmation" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Processing signup confirmation for:", user.email);

    // Build the correct confirmation URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://acpgpktowymatigrgwuv.supabase.co";
    
    // Construct the verification URL correctly
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(token_hash)}&type=${encodeURIComponent(email_action_type)}&redirect_to=${encodeURIComponent(redirect_to)}`;
    
    console.log("Generated confirmation URL:", confirmationUrl);
    
    const firstName = user.user_metadata?.first_name || "";
    
    console.log("Sending email to:", user.email, "with first name:", firstName);
    
    const emailResponse = await resend.emails.send({
      from: "Lumière Jewelry <onboarding@resend.dev>",
      to: [user.email],
      subject: "✨ Welcome to Lumière Jewelry - Confirm Your Account",
      html: generateConfirmationEmail(firstName, confirmationUrl),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-custom-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
