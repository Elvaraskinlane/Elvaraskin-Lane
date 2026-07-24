export default function PrivacyPolicyPage() {
  return (
    <main className="w-full bg-background animate-fade-in pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
        
        <header className="text-center mb-16">
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">Privacy Policy</h1>
          <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">
            Your trust is paramount. We are committed to protecting your personal information and respecting your privacy.
          </p>
        </header>

        <div className="flex flex-col gap-12">
          
          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">Information We Collect</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              When you visit Elvara Skinlane, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              <strong>Personal Information:</strong> Includes your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. This is collected directly from you when you make a purchase or create an account.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              <strong>Device Information:</strong> Includes your web browser version, IP address, time zone, cookie information, what sites or products you view, and how you interact with our site. This is collected automatically using cookies and similar tracking technologies.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">How We Use Your Information</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              We use your Personal Information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              We use your Device Information to help us screen for potential risk and fraud, and more generally to improve and optimize our site (for example, by generating analytics about how our customers browse and interact with the site, and to assess the success of our marketing and advertising campaigns).
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">Sharing Your Information</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              We share your Personal Information with trusted service providers to help us provide our services and fulfill our contracts with you, as described above. For example, we use WordPress/WooCommerce to power our online store and secure payment processors to handle transactions.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">Your Rights</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              You have the right to access the personal information we hold about you and to ask that your personal information be corrected, updated, or erased. If you would like to exercise this right, please contact us through the contact information below.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              This policy complies with the Nigeria Data Protection Act (NDPA) and NDPR. As a resident of Nigeria, you have specific rights regarding the collection and processing of your data. Please contact us for any specific data requests.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">Contact Us</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <strong>elvaraskinlane@gmail.com</strong> or by mail using the details provided on our Contact page.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
