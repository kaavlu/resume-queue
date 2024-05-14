import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables from .env file
const env = config();
const RESEND_API_KEY = env.RESEND_API_KEY || "re_CNg4kUH8_56RV9EtNT1Rjj1FbC44URkeS"; // Ensure the API key is in your .env file

const handler = async (request: Request): Promise<Response> => {
  console.log("Received request");

  // Check if the method is POST
  if (request.method !== "POST") {
    console.log("Method not allowed");
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { to, subject, html } = body;

    console.log("Request body:", body);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>",
        to: [to], // Using the "to" email from the request
        subject: subject, // Using the "subject" from the request
        html: html, // Using the "html" message from the request
      }),
    });

    const data = await res.json();

    console.log("API response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

serve(handler);
