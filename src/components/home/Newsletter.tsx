"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { verifyTurnstileToken } from "@/app/actions/turnstile";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      if (!turnstileToken) {
        throw new Error("Please complete the security check.");
      }
      const verifyResult = await verifyTurnstileToken(turnstileToken);
      if (!verifyResult.success) {
        throw new Error("Security check failed. Please try again.");
      }
      
      // Simulate API call delay
      setTimeout(() => {
      console.log(`Subscribing email: ${email}`);
        setStatus("success");
        setEmail("");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setStatus("idle");
    }
  };

  return (
    <section className="bg-surface-container py-24 border-t border-outline-variant/20">
      <div className="max-w-2xl mx-auto px-margin-mobile text-center">
        <h2 className="font-headline-md text-headline-md text-on-background mb-4">Join the Inner Circle</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-10">
          Subscribe to receive gentle reminders, exclusive access to new rituals, and complimentary shipping on your first order.
        </p>
        
        {status === "success" ? (
          <div className="py-3 font-label-md text-label-md text-primary">
            Welcome to the Inner Circle. Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col mx-auto gap-4">
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-md font-body-md text-sm text-left">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input 
                type="email" 
                id="email" 
                required
                disabled={status === "loading"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 font-body-md text-body-md text-on-background placeholder:text-on-surface-variant/50 transition-colors disabled:opacity-50 outline-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="shrink-0 px-8 py-3 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-on-background transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Joining..." : "Subscribe"}
              </button>
            </div>
            
            {/* Cloudflare Turnstile */}
            <div className="cf-turnstile self-center" data-action="turnstile-spin-v2">
              <Turnstile 
                siteKey="0x4AAAAAAD7LNMDvUnit7Q_H" 
                onSuccess={(token) => setTurnstileToken(token)}
                options={{ action: "turnstile-spin-v2" }}
              />
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
