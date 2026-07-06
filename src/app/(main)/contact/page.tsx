import ContactHeader from "@/components/contact/ContactHeader";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import StoreLocator from "@/components/contact/StoreLocator";

export const metadata = {
  title: "Contact Us - Elvara Skinlane",
  description: "Reach out to the Elvara Skinlane concierge for bespoke skincare advice and support.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full animate-fade-in">
      <ContactHeader />
      
      <section className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pb-margin-desktop md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16">
        <ContactForm />
        <ContactInfo />
      </section>

      <StoreLocator />
    </div>
  );
}
