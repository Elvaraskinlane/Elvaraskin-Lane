"use client";

import { useState } from "react";
import Image from "next/image";
import { useUIStore } from "@/store/useUIStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { loginCustomer } from "@/lib/auth";
import { Turnstile } from "@marsidev/react-turnstile";
import { verifyTurnstileToken } from "@/app/actions/turnstile";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  
  // Connect directly to the global store
  const { isAuthModalOpen, closeAuthModal } = useUIStore();
  const { items } = useWishlistStore();
  const { login } = useAuthStore();
  const router = useRouter();

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
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

      const data = await loginCustomer(username, password);
      login({
        token: data.token,
        user_email: data.user_email,
        user_nicename: data.user_nicename,
        user_display_name: data.user_display_name,
      });
      closeAuthModal();
      router.push("/account");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md px-4 py-8 overflow-y-auto">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={closeAuthModal}></div>
      
      <div className="relative z-10 w-full max-w-4xl bg-surface shadow-2xl rounded-sm border border-outline-variant/10 animate-fade-in flex flex-col md:flex-row overflow-hidden my-auto min-h-[500px]">
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors z-20 bg-surface/50 rounded-full p-1 md:bg-transparent"
        >
          <span className="material-symbols-outlined font-light text-2xl">close</span>
        </button>

        {/* Left Column (The Teaser) */}
        <div className="w-full md:w-1/2 bg-surface-container-lowest p-8 md:p-12 border-b md:border-b-0 md:border-r border-outline-variant/10 flex flex-col">
          <h2 className="font-headline-sm text-lg tracking-[0.15em] text-on-surface uppercase mb-8">Your Wishlist</h2>
          
          {/* Dynamic Wishlist Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                <span className="material-symbols-outlined text-4xl mb-4 font-light text-on-surface-variant">favorite</span>
                <p className="font-body-md text-sm text-on-surface-variant">Your wishlist is currently empty.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-20 h-24 bg-surface relative rounded-sm overflow-hidden border border-outline-variant/10 flex-shrink-0">
                    <Image 
                      src={item.image || "/hero-3.png"} 
                      alt={item.name} 
                      fill 
                      className="object-cover mix-blend-multiply p-1" 
                    />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-sm text-on-surface leading-tight mb-1" dangerouslySetInnerHTML={{ __html: item.name }} />
                    <p className="font-body-md text-xs text-on-surface-variant uppercase tracking-widest">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(item.price) || 0)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-auto pt-12">
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Sign in to save your wishlist, checkout faster, and track your orders.
            </p>
          </div>
        </div>

        {/* Right Column (The Auth Form) */}
        <div className="w-full md:w-1/2 bg-surface p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="font-headline-sm text-2xl tracking-tight text-on-surface mb-2">Welcome Back</h2>
            <p className="font-body-md text-sm text-on-surface-variant">Enter your details to access your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-md font-body-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant" htmlFor="username">
                Username or email address *
              </label>
              <input 
                id="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 bg-transparent border-b border-outline-variant/30 text-on-surface focus:outline-none focus:border-on-surface transition-colors font-body-md"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant" htmlFor="password">
                Password *
              </label>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-transparent border-b border-outline-variant/30 text-on-surface focus:outline-none focus:border-on-surface transition-colors font-body-md"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary bg-transparent accent-primary cursor-pointer"
              />
              <label htmlFor="remember" className="font-body-md text-sm text-on-surface-variant cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Cloudflare Turnstile */}
            <div className="mt-4 cf-turnstile" data-action="turnstile-spin-v2">
              <Turnstile 
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} 
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken("XXXX.DUMMY.TOKEN.XXXX")}
                onExpire={() => setTurnstileToken("")}
                options={{ action: "turnstile-spin-v2" }}
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-on-background text-background py-4 font-label-lg tracking-[0.2em] uppercase text-sm hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>
          </form>
          
          <div className="mt-8 flex flex-col items-center space-y-4">
            <Link href="/register" onClick={closeAuthModal} className="font-label-md text-xs uppercase tracking-widest text-on-surface hover:text-primary transition-colors underline underline-offset-4 decoration-outline-variant/30">
              CREATE ACCOUNT
            </Link>
            <Link href="/forgot-password" onClick={closeAuthModal} className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4 decoration-outline-variant/30">
              LOST YOUR PASSWORD?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
