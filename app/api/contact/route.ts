import React from "react";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

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

const EmailTemplate = ({
  name,

  email,

  subject,

  message,
}: {
  name: string;

  email: string;

  subject: string;

  message: string;
}) =>
  React.createElement(
    "div",

    { style: { fontFamily: "sans-serif", lineHeight: "1.5", color: "#333" } },

    React.createElement("h2", null, "New Message"),

    React.createElement("hr", { style: { borderColor: "#eee" } }),

    React.createElement(
      "p",

      null,

      React.createElement("strong", null, "Name:"),

      ` ${name}`
    ),

    React.createElement(
      "p",

      null,

      React.createElement("strong", null, "Email:"),

      ` ${email}`
    ),

    React.createElement(
      "p",

      null,

      React.createElement("strong", null, "Subject:"),

      ` ${subject}`
    ),

    React.createElement(
      "p",

      null,

      React.createElement("strong", null, "Message:")
    ),

    React.createElement("p", { style: { whiteSpace: "pre-wrap" } }, message)
  );

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = contactSchema.parse(body);
    const { name, email, subject, message, website } = parsedData;

    if (website) {
      return NextResponse.json({ success: true, message: "Filtered" });
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Email <onboarding@resend.dev>",
      to: [process.env.CONTACT_RECEIVER_EMAIL || "admin@example.com"],
      subject: `MEGP: ${subject}`,
      react: React.createElement(EmailTemplate, {
        name,
        email,
        subject,
        message,
      }),
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
