"use server";

import { Resend } from "resend";
import { verifyTurnstileToken } from "./turnstile";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}) {
  try {
    // 1. Verify Turnstile token first
    const verifyResult = await verifyTurnstileToken(formData.turnstileToken);
    if (!verifyResult.success) {
      return { success: false, error: "Security check failed. Please try again." };
    }

    // 2. Format the email content
    const subjectLine = formData.subject 
      ? `New Inquiry: ${formData.subject}` 
      : "New Customer Inquiry";

    // 3. Send email via Resend
    const data = await resend.emails.send({
      from: "Elvara Skinlane <onboarding@resend.dev>", // resend.dev is allowed for testing without custom domain verification
      to: "elvaraskinlane@gmail.com",
      subject: subjectLine,
      html: `
        <h2>New message from Elvara Skinlane Contact Form</h2>
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Subject:</strong> ${formData.subject || "Not provided"}</p>
        <h3>Message:</h3>
        <p>${formData.message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send contact email:", error);
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}
