"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      if (!turnstileToken) {
        throw new Error("Please complete the security check.");
      }

      const formData = new FormData(e.currentTarget);
      const data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        turnstileToken,
      };

      const result = await submitContactForm(data);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to send message. Please try again.");
      }
      
      setStatus("success");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 border border-surface-variant rounded shadow-[0_30px_60px_rgba(44,44,44,0.04)] flex flex-col items-center justify-center text-center min-h-[500px]">
        <span className="material-symbols-outlined text-primary text-5xl mb-4">mark_email_read</span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Message Sent</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Thank you for reaching out. A member of the Elvara Skinlane concierge team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 border border-surface-variant rounded shadow-[0_30px_60px_rgba(44,44,44,0.04)]">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-8">Send a Message</h2>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-md font-body-md text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <label className="font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="firstName">First Name</label>
            <input 
              id="firstName" 
              name="firstName"
              required 
              type="text" 
              className="w-full py-2 bg-transparent border-0 border-b border-secondary-fixed-dim focus:ring-0 focus:border-primary transition-colors duration-200 rounded-none font-body-md text-body-md text-on-surface"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="lastName">Last Name</label>
            <input 
              id="lastName" 
              name="lastName"
              required 
              type="text" 
              className="w-full py-2 bg-transparent border-0 border-b border-secondary-fixed-dim focus:ring-0 focus:border-primary transition-colors duration-200 rounded-none font-body-md text-body-md text-on-surface"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
          <input 
            id="email" 
            name="email"
            required 
            type="email" 
            className="w-full py-2 bg-transparent border-0 border-b border-secondary-fixed-dim focus:ring-0 focus:border-primary transition-colors duration-200 rounded-none font-body-md text-body-md text-on-surface"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="subject">Subject (Optional)</label>
          <select 
            id="subject" 
            name="subject"
            className="w-full py-2 bg-transparent border-0 border-b border-secondary-fixed-dim focus:ring-0 focus:border-primary transition-colors duration-200 rounded-none font-body-md text-body-md text-on-surface cursor-pointer appearance-none"
          >
            <option value="">Select an inquiry type</option>
            <option value="order">Order Inquiry</option>
            <option value="product">Product Consultation</option>
            <option value="press">Press & Media</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="message">Message</label>
          <textarea 
            id="message" 
            name="message"
            required 
            rows={5}
            className="w-full py-2 bg-transparent border-0 border-b border-secondary-fixed-dim focus:ring-0 focus:border-primary transition-colors duration-200 rounded-none font-body-md text-body-md text-on-surface resize-none"
          ></textarea>
        </div>

        {/* Cloudflare Turnstile */}
        <div className="cf-turnstile" data-action="turnstile-spin-v2">
          <Turnstile 
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} 
            onSuccess={(token) => setTurnstileToken(token)}
            options={{ action: "turnstile-spin-v2" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full md:w-auto px-8 py-4 bg-on-background text-on-tertiary font-label-md text-label-md hover:bg-tertiary hover:text-on-tertiary transition-colors duration-300 rounded-sm disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
