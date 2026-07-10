import React from "react";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

import { rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(5, "Message must be at least 5 characters"),
  website: z.string().optional(),
});

interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EmailTemplate = ({ name, email, subject, message }: EmailTemplateProps) =>
  React.createElement(
    "div",
    { style: { fontFamily: "sans-serif", lineHeight: "1.5", color: "#333" } },
    React.createElement("h2", { style: { color: "#0ea5e9", marginBottom: "16px" } }, "New Message from Portfolio"),
    React.createElement("hr", { style: { borderColor: "#e5e7eb", marginBottom: "16px" } }),
    React.createElement("p", { style: { margin: "8px 0" } }, React.createElement("strong", null, "Name: "), name),
    React.createElement("p", { style: { margin: "8px 0" } }, React.createElement("strong", null, "Email: "), email),
    React.createElement("p", { style: { margin: "8px 0" } }, React.createElement("strong", null, "Subject: "), subject),
    React.createElement("p", { style: { margin: "8px 0" } }, React.createElement("strong", null, "Message:")),
    React.createElement("p", { 
      style: { whiteSpace: "pre-wrap", backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px", marginTop: "8px" } 
    }, message)
  );

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const limitResult = rateLimit(ip, 3, 2 * 60 * 1000); // 3 emails per 2 minutes max
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many messages sent. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { turnstileToken } = body;

    // Verify Cloudflare Turnstile token
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "1x00000000000000000000000000000000OP";
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken || "")}&remoteip=${encodeURIComponent(ip)}`,
    });
    
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json(
        { success: false, error: "Captcha verification failed. Please try again." },
        { status: 400 }
      );
    }

    const parsedData = contactSchema.parse(body);
    const { name, email, subject, message, website } = parsedData;

    if (website) {
      return NextResponse.json({ success: true, message: "Filtered" });
    }

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_SENDER_EMAIL || '"Portfolio Email" <onboarding@resend.dev>',
      to: [process.env.CONTACT_RECEIVER_EMAIL || "admin@example.com"],
      subject: `MEGP: ${subject}`,
      react: React.createElement(EmailTemplate, { name, email, subject, message }),
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let errorMessage = "Something went wrong";
    if (error instanceof z.ZodError) {
      errorMessage = error.issues[0].message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
