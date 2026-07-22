"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { verifyTurnstileToken } from "@/app/actions/turnstile";
import Link from "next/link";

export default function LoginForm() {
  const [view, setView] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!turnstileToken) {
        throw new Error("Please complete the security check.");
      }
      const verifyResult = await verifyTurnstileToken(turnstileToken);
      if (!verifyResult.success) {
        throw new Error("Security check failed. Please try again.");
      }

      // TODO: Wire up NextAuth or Supabase auth here
      setTimeout(() => setIsLoading(false), 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface relative z-10 w-full h-full">
      <div className="w-full max-w-md space-y-12">
        {/* Header */}
        <div className="text-center md:text-left space-y-4">
          <Link href="/" className="inline-block mb-8">
            <span className="font-headline-sm text-headline-sm italic text-primary">Elvara Skinlane</span>
          </Link>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface">
            Welcome<br/>Back
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Enter your details to access your account.
          </p>
        </div>

        {/* Toggle View */}
        <div className="flex border-b border-outline-variant/30 mb-8">
          <button 
            onClick={() => setView("login")}
            className={`flex-1 pb-4 font-label-md text-label-md transition-colors ${view === "login" ? "border-b border-primary text-primary" : "text-on-surface-variant hover:text-primary"}`}
          >
            Login
          </button>
          <button 
            onClick={() => setView("register")}
            className={`flex-1 pb-4 font-label-md text-label-md transition-colors ${view === "register" ? "border-b border-primary text-primary" : "text-on-surface-variant hover:text-primary"}`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-md font-body-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2 group">
            <label className="font-label-md text-label-md text-on-surface-variant group-focus-within:text-primary transition-colors" htmlFor="email">
              Email Address
            </label>
            <input 
              id="email" 
              type="email" 
              required
              placeholder="your@email.com" 
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline-variant/50 outline-none"
            />
          </div>

          <div className="space-y-2 group relative">
            <div className="flex justify-between items-baseline">
              <label className="font-label-md text-label-md text-on-surface-variant group-focus-within:text-primary transition-colors" htmlFor="password">
                Password
              </label>
              {view === "login" && (
                <Link href="/forgot-password" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors text-xs">
                  Forgot Password?
                </Link>
              )}
            </div>
            <input 
              id="password" 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline-variant/50 outline-none"
            />
            <button type="button" className="absolute right-0 bottom-3 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">visibility_off</span>
            </button>
          </div>

          {/* Cloudflare Turnstile */}
          <div className="cf-turnstile" data-action="turnstile-spin-v2">
            <Turnstile 
              siteKey="0x4AAAAAAD7LNMDvUnit7Q_H" 
              onSuccess={(token) => setTurnstileToken(token)}
              options={{ action: "turnstile-spin-v2" }}
            />
          </div>

          <div className="pt-6 space-y-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-on-surface text-on-primary py-4 px-8 font-label-md text-label-md tracking-widest hover:bg-primary transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? "AUTHENTICATING..." : (view === "login" ? "SIGN IN" : "CREATE ACCOUNT")}
            </button>
            <Link 
              href="/shop"
              className="w-full bg-transparent border border-secondary-fixed-dim text-on-surface py-4 px-8 font-label-md text-label-md tracking-widest hover:bg-surface-container-low transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">person</span>
              CONTINUE AS GUEST
            </Link>
          </div>
        </form>

        <div className="text-center pt-8">
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            By continuing, you agree to our <Link href="/terms" className="underline underline-offset-4 hover:text-primary transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-4 hover:text-primary transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
