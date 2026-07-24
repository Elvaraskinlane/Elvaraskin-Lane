"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AccountSettingsPage() {
  const { user, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "", // Only sent if changed
    billing: {
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      phone: ""
    }
  });

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      fetch("/api/account/settings", {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      })
      .then(res => {
        if (res.status === 401) {
          useAuthStore.getState().logout();
          return { error: "Unauthorized" };
        }
        return res.json();
      })
      .then(data => {
        if (data.error === "Unauthorized") return;
        if (data.customer) {
          setFormData({
            ...formData,
            first_name: data.customer.first_name || "",
            last_name: data.customer.last_name || "",
            email: data.customer.email || "",
            billing: {
              address_1: data.customer.billing?.address_1 || "",
              address_2: data.customer.billing?.address_2 || "",
              city: data.customer.billing?.city || "",
              state: data.customer.billing?.state || "",
              postcode: data.customer.billing?.postcode || "",
              country: data.customer.billing?.country || "",
              phone: data.customer.billing?.phone || "",
            }
          });
        }
      })
      .catch(err => console.error("Failed to load settings:", err))
      .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("billing.")) {
      const billingField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        billing: {
          ...prev.billing,
          [billingField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/account/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Account settings updated successfully." });
        // Clear password field after save
        setFormData(prev => ({ ...prev, password: "" }));
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update settings." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-8 bg-surface-container w-48 rounded"></div>
        <div className="h-64 bg-surface-container rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-12">
      <header className="border-b border-outline-variant/30 pb-6">
        <h1 className="font-headline-md text-on-surface">Account Settings</h1>
        <p className="font-body-md text-on-surface-variant mt-2">
          Manage your personal details, billing address, and security preferences securely synced with your WooCommerce account.
        </p>
      </header>

      {message.text && (
        <div className={`p-4 rounded-md font-body-md ${message.type === 'success' ? 'bg-primary-container text-on-primary-container border border-primary/20' : 'bg-error-container text-on-error-container border border-error/20'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/15 rounded-md p-8">
        <form className="space-y-10" onSubmit={handleSubmit}>
          
          {/* Profile Section */}
          <section>
            <h2 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant font-light">person</span>
              Personal Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-md text-on-surface-variant mb-2">First Name</label>
                <input 
                  type="text" 
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-md text-on-surface-variant mb-2">Last Name</label>
                <input 
                  type="text" 
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="font-label-md text-on-surface-variant mb-2">Email Address <span className="text-xs text-on-surface-variant/70 font-normal ml-2">(Cannot be changed)</span></label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-[#f5f5f5] border border-outline-variant/30 rounded-sm px-4 py-3 text-on-surface-variant/70 cursor-not-allowed outline-none font-body-md" 
                />
              </div>
            </div>
          </section>

          <hr className="border-outline-variant/20" />

          {/* Security Section */}
          <section>
            <h2 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant font-light">lock</span>
              Security
            </h2>
            <div className="flex flex-col max-w-md">
              <label className="font-label-md text-on-surface-variant mb-2">Change Password <span className="text-xs text-on-surface-variant/70 font-normal ml-2">(Leave blank to keep current)</span></label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
              />
            </div>
          </section>

          <hr className="border-outline-variant/20" />

          {/* Billing Address Section */}
          <section>
            <h2 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant font-light">local_shipping</span>
              Billing & Shipping Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:col-span-2">
                <label className="font-label-md text-on-surface-variant mb-2">Street Address</label>
                <input 
                  type="text" 
                  name="billing.address_1"
                  value={formData.billing.address_1}
                  onChange={handleChange}
                  placeholder="House number and street name"
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all mb-3 font-body-md" 
                />
                <input 
                  type="text" 
                  name="billing.address_2"
                  value={formData.billing.address_2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-md text-on-surface-variant mb-2">City</label>
                <input 
                  type="text" 
                  name="billing.city"
                  value={formData.billing.city}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-md text-on-surface-variant mb-2">State / County</label>
                <input 
                  type="text" 
                  name="billing.state"
                  value={formData.billing.state}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-md text-on-surface-variant mb-2">Postcode / ZIP</label>
                <input 
                  type="text" 
                  name="billing.postcode"
                  value={formData.billing.postcode}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
                />
              </div>
              <div className="flex flex-col">
                <label className="font-label-md text-on-surface-variant mb-2">Country</label>
                <input 
                  type="text" 
                  name="billing.country"
                  value={formData.billing.country}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="font-label-md text-on-surface-variant mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="billing.phone"
                  value={formData.billing.phone}
                  onChange={handleChange}
                  className="w-full bg-[#fafafa] border border-outline-variant/30 rounded-sm px-4 py-3 focus:ring-1 focus:ring-black focus:border-black text-on-background outline-none transition-all font-body-md" 
                />
              </div>
            </div>
          </section>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={saving}
              className={`bg-black text-white font-label-md px-10 py-4 uppercase tracking-[0.2em] rounded-full hover:bg-primary transition-all shadow-md flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>sync</span>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
