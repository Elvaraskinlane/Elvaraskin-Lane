export default function ContactHeader() {
  return (
    <header className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop md:py-32 flex flex-col items-center text-center">
      <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
        Contact Us
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
        We're here to assist you with your skincare journey. Reach out with any inquiries, bespoke requests, or simply to connect.
      </p>
    </header>
  );
}
