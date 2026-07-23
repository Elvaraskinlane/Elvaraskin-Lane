"use client";

import { useState } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { verifyTurnstileToken } from "@/app/actions/turnstile";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      if (!turnstileToken) {
        throw new Error("Please complete the security check.");
      }
      const verifyResult = await verifyTurnstileToken(turnstileToken);
      if (!verifyResult.success) {
        throw new Error("Security check failed. Please try again.");
      }

      const response = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
      <div className="w-full max-w-md flex flex-col gap-8 bg-surface/70 backdrop-blur-md border border-outline-variant/30 shadow-md rounded-2xl p-8 md:p-10">
        
        {/* Header */}
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">vpn_key</span>
          <h1 className="font-headline-md text-on-surface mb-2">Reset Password</h1>
          <p className="font-body-md text-on-surface-variant">
            Enter the email address associated with your account, and we'll send you a link to reset your password.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-primary-container/30 border border-primary/20 p-6 rounded-xl text-center">
            <span className="material-symbols-outlined text-primary text-3xl mb-3">mark_email_read</span>
            <h3 className="font-headline-sm text-on-surface mb-2">Check Your Email</h3>
            <p className="font-body-md text-on-surface-variant text-sm">
              If an account exists with that email address, a password reset link has been sent to it. Please check your inbox (and spam folder).
            </p>
            <Link href="/" className="inline-block mt-6 font-label-md text-primary hover:underline">
              Return Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-md font-body-sm text-sm border border-error/20">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-label-md text-on-surface-variant">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary text-on-background outline-none transition-all placeholder:text-on-surface-variant/40"
              />
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
              disabled={loading}
              className={`bg-on-background text-background font-label-lg px-6 py-4 rounded-md uppercase tracking-[0.1em] hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  Sending...
                </>
              ) : "Send Reset Link"}
            </button>
            
            <div className="text-center mt-2">
              <Link href="/" className="font-label-md text-on-surface-variant hover:text-primary transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
