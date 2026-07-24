"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { processCheckout } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, fetchCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStoreDown, setIsStoreDown] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    city: "",
    state: "",
    country: "NG", // Defaulting to Nigeria
    createAccount: false,
    password: "",
  });

  useEffect(() => {
    setMounted(true);
    if (!cart) {
      fetchCart();
    }
    
    // Pre-fill form if user is logged in
    if (isAuthenticated && user) {
      setFormData(prev => {
        // Only update if the form fields are currently empty (prevents overwriting user edits)
        const nameParts = user.user_display_name ? user.user_display_name.split(' ') : [];
        return {
          ...prev,
          first_name: prev.first_name || nameParts[0] || "",
          last_name: prev.last_name || nameParts.slice(1).join(' ') || "",
          email: prev.email || user.user_email || "",
        };
      });
    }
  }, [cart, fetchCart, isAuthenticated, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    
    if (!e.currentTarget.checkValidity()) {
      return;
    }

    if (!cart || cart.items.length === 0) return;

    setIsProcessing(true);
    setIsStoreDown(false);

    try {
      // Step A: Instantiate the order in WooCommerce via the Store API
      const checkoutResponse = await processCheckout(formData);
      
      // Step B: Extract order details and setup Paystack Inline Script
      const orderId = checkoutResponse.order_id || checkoutResponse.id; // WC Store API uses order_id
      
      if (!orderId) {
        throw new Error("Failed to retrieve Order ID from checkout response");
      }
      const cartTotalAmount = Number(cart.totals.total_price); 

      // Native Paystack Initialization
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY || "pk_test_placeholder",
        email: formData.email,
        amount: Math.round(cartTotalAmount), // Already in minor units (kobo) from WooCommerce
        currency: "NGN",
        ref: `ref_${Math.floor(Math.random() * 1000000000 + 1)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: orderId.toString(),
            },
          ],
        },
        callback: function (response: any) {
          // Step C: Reconcile and redirect upon successful payment
          (async () => {
            try {
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  reference: response.reference,
                  orderId: orderId,
                })
              });

              if (!verifyRes.ok) {
                console.error("Payment verification failed on the server.");
              }
            } catch (err) {
              console.error("Payment verification request failed:", err);
            } finally {
              clearCart();
              router.push(`/order-success?reference=${response.reference}`);
            }
          })();
        },
        onClose: function () {
          setIsProcessing(false);
          alert("Payment window closed.");
        },
      });

      handler.openIframe();

    } catch (error: any) {
      console.error("Checkout Error:", error);
      setIsStoreDown(true); // Trigger WhatsApp fallback
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: string | number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format((Number(amount) / 100) || 0); // WooCommerce Store API returns minor units
  };

  if (!mounted) return null;

  return (
    <>
      {/* Native Script Injection for Paystack */}
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <div className="flex items-center gap-2 mb-8 text-sm text-on-surface-variant animate-fade-in">
        <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="font-bold text-on-background">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 animate-fade-in">
        {/* Left Column: Billing Form */}
        <div className="lg:col-span-7">
          <h2 className="font-headline-sm text-lg text-on-surface uppercase tracking-widest mb-8 border-b border-outline-variant/30 pb-4">
            Billing Details
          </h2>

          {isAuthenticated && user ? (
            <div className="mb-8 p-4 bg-secondary-container/20 border border-secondary-container rounded-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">account_circle</span>
              <div>
                <p className="font-body-md text-sm text-on-surface mb-1">
                  You are checked in as <span className="font-medium">{user.user_email}</span>.
                </p>
                <button 
                  onClick={() => logout()}
                  className="font-label-md text-xs text-primary uppercase tracking-wider hover:underline"
                >
                  Not you? Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-surface-container border border-outline-variant/30 rounded-sm flex items-center justify-between">
              <p className="font-body-md text-sm text-on-surface-variant">
                Returning customer?
              </p>
              <button 
                type="button"
                onClick={() => {
                  import("@/store/useUIStore").then(module => {
                    module.useUIStore.getState().openAuthModal();
                  });
                }}
                className="font-label-md text-xs text-primary uppercase tracking-wider hover:underline"
              >
                Click here to log in
              </button>
            </div>
          )}

          <form id="checkout-form" onSubmit={handlePayment} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`w-full h-14 bg-surface-container-lowest border px-4 focus:outline-none focus:border-on-surface transition-colors ${hasAttemptedSubmit && !formData.first_name ? 'border-error' : 'border-outline-variant/30'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`w-full h-14 bg-surface-container-lowest border px-4 focus:outline-none focus:border-on-surface transition-colors ${hasAttemptedSubmit && !formData.last_name ? 'border-error' : 'border-outline-variant/30'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full h-14 bg-surface-container-lowest border px-4 focus:outline-none focus:border-on-surface transition-colors ${hasAttemptedSubmit && !formData.email ? 'border-error' : 'border-outline-variant/30'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full h-14 bg-surface-container-lowest border px-4 focus:outline-none focus:border-on-surface transition-colors ${hasAttemptedSubmit && !formData.phone ? 'border-error' : 'border-outline-variant/30'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">Street Address *</label>
              <input
                type="text"
                name="address_1"
                required
                value={formData.address_1}
                onChange={handleInputChange}
                className={`w-full h-14 bg-surface-container-lowest border px-4 focus:outline-none focus:border-on-surface transition-colors ${hasAttemptedSubmit && !formData.address_1 ? 'border-error' : 'border-outline-variant/30'}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">Town / City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full h-14 bg-surface-container-lowest border px-4 focus:outline-none focus:border-on-surface transition-colors ${hasAttemptedSubmit && !formData.city ? 'border-error' : 'border-outline-variant/30'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">State / County *</label>
                <div className="relative">
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={(e) => handleInputChange(e as any)}
                    className={`w-full h-14 bg-surface-container-lowest border px-4 focus:outline-none focus:border-on-surface transition-colors appearance-none cursor-pointer ${hasAttemptedSubmit && !formData.state ? 'border-error' : 'border-outline-variant/30'}`}
                  >
                    <option value="" disabled>Select a state</option>
                    <option value="AB">Abia</option>
                    <option value="FC">Abuja (FCT)</option>
                    <option value="AD">Adamawa</option>
                    <option value="AK">Akwa Ibom</option>
                    <option value="AN">Anambra</option>
                    <option value="BA">Bauchi</option>
                    <option value="BY">Bayelsa</option>
                    <option value="BE">Benue</option>
                    <option value="BO">Borno</option>
                    <option value="CR">Cross River</option>
                    <option value="DE">Delta</option>
                    <option value="EB">Ebonyi</option>
                    <option value="ED">Edo</option>
                    <option value="EK">Ekiti</option>
                    <option value="EN">Enugu</option>
                    <option value="GO">Gombe</option>
                    <option value="IM">Imo</option>
                    <option value="JI">Jigawa</option>
                    <option value="KD">Kaduna</option>
                    <option value="KN">Kano</option>
                    <option value="KT">Katsina</option>
                    <option value="KE">Kebbi</option>
                    <option value="KO">Kogi</option>
                    <option value="KW">Kwara</option>
                    <option value="LA">Lagos</option>
                    <option value="NA">Nasarawa</option>
                    <option value="NI">Niger</option>
                    <option value="OG">Ogun</option>
                    <option value="ON">Ondo</option>
                    <option value="OS">Osun</option>
                    <option value="OY">Oyo</option>
                    <option value="PL">Plateau</option>
                    <option value="RI">Rivers</option>
                    <option value="SO">Sokoto</option>
                    <option value="TA">Taraba</option>
                    <option value="YO">Yobe</option>
                    <option value="ZA">Zamfara</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Account Checkbox - ONLY SHOW IF NOT LOGGED IN */}
            {!isAuthenticated && (
              <>
                <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="createAccount"
                    name="createAccount"
                    checked={formData.createAccount || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, createAccount: e.target.checked }))}
                    className="mt-1 w-4 h-4 text-primary bg-surface border-outline-variant focus:ring-primary focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="createAccount" className="font-body-md text-on-surface-variant cursor-pointer select-none">
                    <span className="block font-medium text-on-surface mb-0.5">Create an account?</span>
                    Check this box to automatically create an Elvara account with these details so you can track your order status later.
                  </label>
                </div>

                {formData.createAccount && (
                  <div className="space-y-2 animate-fade-in mt-4">
                    <label className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant">Account Password *</label>
                    <input
                      type="password"
                      name="password"
                      required={formData.createAccount}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-surface-container-lowest border border-outline-variant/30 px-4 focus:outline-none focus:border-on-surface transition-colors"
                      placeholder="Enter a secure password"
                    />
                  </div>
                )}
              </>
            )}
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-low p-8 sticky top-24 border border-outline-variant/20 rounded-sm">
            <h2 className="font-headline-sm text-lg text-on-surface uppercase tracking-widest mb-8 border-b border-outline-variant/30 pb-4">
              Your Order
            </h2>

            {!cart || cart.items.length === 0 ? (
              <p className="text-on-surface-variant font-body-md text-sm">Your cart is currently empty.</p>
            ) : (
              <>
                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                  {cart.items.map((item) => (
                    <div key={item.key} className="flex gap-4">
                      <div className="w-16 h-20 bg-surface relative flex-shrink-0 border border-outline-variant/10 rounded-sm overflow-hidden">
                        <Image
                          src={item.images[0]?.src || "/hero-3.png"}
                          alt={item.name}
                          fill
                          className="object-cover mix-blend-multiply p-1"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <h3 className="font-headline-sm text-sm text-on-surface mb-1 leading-tight" dangerouslySetInnerHTML={{ __html: item.name }} />
                        <p className="font-body-md text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex flex-col justify-center items-end">
                        <span className="font-label-md text-sm text-on-surface uppercase tracking-widest">
                          {formatPrice(item.prices.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-outline-variant/30 pt-6 space-y-4 mb-8">
                  <div className="flex justify-between items-center text-on-surface-variant font-body-md">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.totals.total_price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant font-body-md">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                  <div className="flex justify-between items-center text-on-background font-headline-sm text-xl pt-4 border-t border-outline-variant/30">
                    <span>Total</span>
                    <span>{formatPrice(cart.totals.total_price)}</span>
                  </div>
                </div>

                {isStoreDown && (
                  <div className="bg-error/10 border border-error/20 p-4 rounded-sm mb-4 animate-fade-in">
                    <p className="font-body-md text-sm text-error">
                      <span className="font-bold">High traffic alert:</span> We are currently unable to process live payments. Please place your order via WhatsApp below, and our team will process it manually!
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing || isStoreDown || !cart || cart.items.length === 0}
                  className="w-full h-14 bg-on-background text-background font-label-lg uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-on-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center rounded-sm gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : "Place Order & Pay"}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    if (!cart || cart.items.length === 0) return;
                    let text = `Hello Elvara Skinlane,\n\nI would like to place an order via WhatsApp.\n\n*Order Details:*\n`;
                    cart.items.forEach((item) => {
                      // Basic strip of HTML tags just in case
                      const itemName = item.name.replace(/<[^>]*>?/gm, '');
                      text += `- ${item.quantity}x ${itemName}\n`;
                    });
                    text += `\n*Total:* ${formatPrice(cart.totals.total_price)}\n`;
                    text += `\n*Billing Details:*\n`;
                    text += `Name: ${formData.first_name} ${formData.last_name}\n`;
                    text += `Email: ${formData.email}\n`;
                    text += `Phone: ${formData.phone}\n`;
                    text += `Address: ${formData.address_1}, ${formData.city}, ${formData.state}\n`;
                    const encodedText = encodeURIComponent(text);
                    window.open(`https://wa.me/2348089647342?text=${encodedText}`, '_blank');
                  }}
                  disabled={isProcessing || !cart || cart.items.length === 0}
                  className={`w-full mt-4 h-14 bg-transparent border border-on-background text-on-background font-label-lg uppercase tracking-[0.2em] text-sm hover:bg-surface-container-highest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-sm gap-2 ${isStoreDown ? 'animate-pulse ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  <span className="material-symbols-outlined text-[20px]">forum</span>
                  Network Issues? Order via WhatsApp
                </button>

                
                <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant opacity-70">
                  <span className="material-symbols-outlined text-[16px] font-light">lock</span>
                  <span className="font-body-md text-xs">Secured by Paystack</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
