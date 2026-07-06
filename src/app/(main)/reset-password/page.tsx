"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUIStore } from "@/store/useUIStore";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const resetKey = searchParams.get("key");
  const userLogin = searchParams.get("login");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const { openAuthModal } = useUIStore();

  if (!resetKey || !userLogin) {
    return (
      <div className="bg-error-container/20 border border-error/30 p-8 rounded-xl text-center max-w-md w-full mx-auto shadow-md backdrop-blur-md">
        <span className="material-symbols-outlined text-error text-4xl mb-4">error</span>
        <h3 className="font-headline-sm text-on-surface mb-2">Invalid Reset Link</h3>
        <p className="font-body-md text-on-surface-variant text-sm mb-6">
          The password reset link is invalid or missing required parameters. Please request a new link.
        </p>
        <Link href="/forgot-password" className="bg-on-background text-background font-label-md px-6 py-3 rounded-md uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-colors inline-block">
          Request New Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          key: resetKey, 
          login: userLogin, 
          new_password: password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.message || "Failed to reset password. The link may have expired.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-8 bg-surface/70 backdrop-blur-md border border-outline-variant/30 shadow-md rounded-2xl p-8 md:p-10 mx-auto">
      
      {/* Header */}
      <div className="text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">lock_reset</span>
        <h1 className="font-headline-md text-on-surface mb-2">Create New Password</h1>
        <p className="font-body-md text-on-surface-variant">
          Please enter your new password below to regain access to your account.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-primary-container/30 border border-primary/20 p-6 rounded-xl text-center">
          <span className="material-symbols-outlined text-primary text-3xl mb-3">check_circle</span>
          <h3 className="font-headline-sm text-on-surface mb-2">Password Reset Successful</h3>
          <p className="font-body-md text-on-surface-variant text-sm mb-6">
            Your password has been successfully updated. You can now use your new password to log in.
          </p>
          <button 
            onClick={() => {
              // Navigate to home and open login modal
              window.location.href = "/";
              // We could also use Next.js router here, but since auth modal is global state, 
              // redirecting and relying on the user to click login is safer, 
              // or passing a query param like ?login=true
            }}
            className="bg-on-background text-background font-label-md px-6 py-3 rounded-md uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-colors w-full"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-md font-body-sm text-sm border border-error/20">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="new_password" className="font-label-md text-on-surface-variant">New Password</label>
            <input
              id="new_password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary text-on-background outline-none transition-all placeholder:text-on-surface-variant/40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm_password" className="font-label-md text-on-surface-variant">Confirm New Password</label>
            <input
              id="confirm_password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary text-on-background outline-none transition-all placeholder:text-on-surface-variant/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-on-background text-background font-label-lg px-6 py-4 rounded-md uppercase tracking-[0.1em] hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                Resetting...
              </>
            ) : "Reset Password"}
          </button>
          
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
          <span className="font-label-md text-on-surface-variant">Verifying link...</span>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
