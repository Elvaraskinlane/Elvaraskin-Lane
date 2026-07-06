"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutForm() {
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const inputClass = "w-full bg-transparent border-0 border-b border-outline-variant py-2 focus:ring-0 focus:border-primary transition-colors text-on-background placeholder:text-outline-variant/50 outline-none";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter xl:gap-[80px]">
      {/* Left Column: Forms */}
      <form className="col-span-1 lg:col-span-7 space-y-16" onSubmit={(e) => e.preventDefault()}>
        
        {/* Contact Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-headline-sm text-headline-sm text-on-background">Contact</h2>
            <Link href="/login" className="font-label-md text-label-md text-primary hover:text-tertiary transition-colors border-b border-primary hover:border-tertiary pb-0.5">
              Log in
            </Link>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col group relative">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest text-[10px]" htmlFor="email">Email Address</label>
              <input className={inputClass} id="email" placeholder="Enter your email" required type="email" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer group mt-4 w-fit">
              <input type="checkbox" className="w-5 h-5 border-outline-variant rounded-sm text-primary focus:ring-primary bg-transparent cursor-pointer" />
              <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-background transition-colors">Email me with news and offers</span>
            </label>
          </div>
        </section>

        {/* Shipping Section */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-background mb-8">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="flex flex-col md:col-span-2">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest text-[10px]" htmlFor="country">Country/Region</label>
              <select className={inputClass} id="country" defaultValue="NG">
                <option value="NG">Nigeria</option>
                <option value="GH">Ghana</option>
                <option value="ZA">South Africa</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest text-[10px]" htmlFor="firstName">First Name</label>
              <input className={inputClass} id="firstName" required type="text" />
            </div>
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest text-[10px]" htmlFor="lastName">Last Name</label>
              <input className={inputClass} id="lastName" required type="text" />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest text-[10px]" htmlFor="address">Address</label>
              <input className={inputClass} id="address" placeholder="Street address or P.O. Box" required type="text" />
            </div>
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest text-[10px]" htmlFor="city">City</label>
              <input className={inputClass} id="city" required type="text" />
            </div>
            <div className="flex flex-col">
              <label className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest text-[10px]" htmlFor="state">State</label>
              <select className={inputClass} id="state" defaultValue="">
                <option disabled value="">Select State</option>
                <option value="LA">Lagos</option>
                <option value="AB">Abuja</option>
                <option value="PH">Rivers</option>
              </select>
            </div>
          </div>
        </section>

        {/* Payment Section */}
        <section>
          <div className="flex flex-col mb-8">
            <h2 className="font-headline-sm text-headline-sm text-on-background">Payment</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm">All transactions are secure and encrypted.</p>
          </div>
          
          <div className="border border-outline-variant rounded-lg overflow-hidden flex flex-col bg-surface-container-lowest">
            {/* Card Option */}
            <div className="flex flex-col border-b border-outline-variant/50">
              <label className="flex items-center justify-between p-5 cursor-pointer bg-surface-container-low/50">
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-primary focus:ring-primary border-outline-variant bg-transparent cursor-pointer" />
                  <span className="font-body-md text-on-background">Credit / Debit Card</span>
                </div>
                <span className="material-symbols-outlined text-[24px] text-on-surface-variant">credit_card</span>
              </label>
              
              {paymentMethod === "card" && (
                <div className="p-6 bg-surface-container-lowest grid grid-cols-2 gap-x-4 gap-y-6 border-t border-outline-variant/30">
                  <div className="flex flex-col col-span-2 relative">
                    <label className="font-label-md text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">Card Number</label>
                    <input className={inputClass} placeholder="0000 0000 0000 0000" type="text" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-label-md text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">Expiration Date</label>
                    <input className={inputClass} placeholder="MM/YY" type="text" />
                  </div>
                  <div className="flex flex-col relative">
                    <label className="font-label-md text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">Security Code</label>
                    <input className={inputClass} placeholder="CVV" type="text" />
                  </div>
                </div>
              )}
            </div>

            {/* Bank Transfer Option */}
            <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-4">
                <input type="radio" name="payment" value="bank" checked={paymentMethod === "bank"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-primary focus:ring-primary border-outline-variant bg-transparent cursor-pointer" />
                <span className="font-body-md text-on-background">Direct Bank Transfer</span>
              </div>
              <span className="material-symbols-outlined text-[24px] text-on-surface-variant">account_balance</span>
            </label>
          </div>
        </section>

      </form>

      {/* Right Column: Order Summary (Sticky) */}
      <div className="col-span-1 lg:col-span-5 relative mt-12 lg:mt-0">
        <div className="lg:sticky lg:top-24 bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/40 rounded-xl shadow-sm">
          <h2 className="font-headline-sm text-on-background mb-6 pb-6 border-b border-outline-variant/30 flex justify-between items-center">
            <span>Order Summary</span>
            <span className="font-label-md text-on-surface-variant text-sm font-normal">2 Items</span>
          </h2>

          <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
            {/* Item Mock */}
            <div className="flex gap-4 items-start group">
              <div className="w-20 h-24 bg-surface-variant rounded flex-shrink-0 relative overflow-hidden border border-outline-variant/20">
                <Image src="/hero-3.png" alt="Serum" fill className="object-cover" />
                <div className="absolute -top-2 -right-2 bg-on-background text-on-primary w-6 h-6 rounded-full flex items-center justify-center font-label-md text-[10px] z-10 border border-surface-container-lowest">1</div>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-headline-sm text-[18px] leading-tight text-on-background mb-1">Botanical Radiance Serum</h3>
                  <p className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant">30ml / Glass Dropper</p>
                </div>
                <span className="font-body-md text-on-background mt-3">₦ 32,500</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-body-md text-sm">Subtotal</span>
              <span className="font-body-md text-on-background">₦ 77,500</span>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <span className="font-body-md text-sm">Shipping</span>
              <span className="font-body-md text-on-background">₦ 3,500</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end border-t border-outline-variant/50 pt-6 mb-8">
            <span className="font-headline-sm text-on-background">Total</span>
            <div className="text-right">
              <span className="font-label-md text-[10px] uppercase text-on-surface-variant mr-1">NGN</span>
              <span className="font-headline-md text-on-background">₦ 81,000</span>
            </div>
          </div>

          <button type="button" className="w-full bg-on-background text-on-primary font-label-md uppercase tracking-[0.1em] py-5 rounded-sm hover:bg-tertiary transition-colors duration-300 shadow-md flex justify-center items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
