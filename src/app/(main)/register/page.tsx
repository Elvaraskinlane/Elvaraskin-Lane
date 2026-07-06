"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerCustomer, loginCustomer } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Turnstile } from "@marsidev/react-turnstile";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Register the customer via proxy
      await registerCustomer(email, password, firstName);
      
      // 2. Log them in immediately via JWT
      const loginData = await loginCustomer(email, password);
      
      login({
        token: loginData.token,
        user_email: loginData.user_email,
        user_nicename: loginData.user_nicename,
        user_display_name: loginData.user_display_name,
      });

      // 3. Redirect to account
      router.push("/account");

    } catch (err: any) {
      setError(err.message || "Failed to register. You might already have an account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-surface p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/10 rounded-sm">
        <div className="text-center mb-10">
          <h1 className="font-display-md text-3xl text-on-surface mb-4">Create Account</h1>
          <p className="font-body-md text-on-surface-variant">
            Join Elvara Skinlane to manage your rituals, track orders, and sync your wishlist.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-md font-body-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant" htmlFor="firstName">
              First Name *
            </label>
            <input 
              id="firstName"
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-14 bg-surface-container-lowest border border-outline-variant/30 px-4 focus:outline-none focus:border-on-surface transition-colors font-body-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant" htmlFor="email">
              Email Address *
            </label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-surface-container-lowest border border-outline-variant/30 px-4 focus:outline-none focus:border-on-surface transition-colors font-body-md"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant" htmlFor="password">
              Password *
            </label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-surface-container-lowest border border-outline-variant/30 px-4 focus:outline-none focus:border-on-surface transition-colors font-body-md"
              required
              minLength={8}
            />
          </div>

          {/* Cloudflare Turnstile */}
          <div className="pt-2">
            <Turnstile siteKey="1x00000000000000000000AA" />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-on-background text-background py-4 font-label-lg tracking-[0.2em] uppercase text-sm hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "CREATING ACCOUNT..." : "REGISTER"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline-variant/20 pt-8">
          <p className="font-body-md text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
