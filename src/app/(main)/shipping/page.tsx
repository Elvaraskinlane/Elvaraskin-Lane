export default function ShippingReturnsPage() {
  return (
    <main className="w-full bg-background animate-fade-in pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
        
        <header className="text-center mb-16">
          <h1 className="font-headline-lg text-headline-lg text-on-background mb-4">Shipping & Returns</h1>
          <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">
            Everything you need to know about how we deliver luxury to your doorstep, and our commitment to your complete satisfaction.
          </p>
        </header>

        <div className="flex flex-col gap-12">
          
          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">Complimentary Shipping</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              At Elvara Skinlane, we believe the luxury experience extends to how your products are delivered. We are pleased to offer complimentary standard shipping on all orders over $150 within the continental United States.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              For orders under $150, a flat shipping rate of $10 will be applied at checkout. Standard shipping typically takes 3-5 business days. We also offer expedited 2-day shipping for $25 if you need your essentials sooner.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">Order Processing</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              All orders are processed and shipped from our fulfillment center within 1-2 business days. Orders placed after 12 PM EST on Fridays, or on weekends and holidays, will be processed the following business day.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Once your order has shipped, you will receive an email containing your tracking information so you can monitor its journey to you.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">Our Return Policy</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              Your satisfaction is our highest priority. If you are not completely satisfied with your purchase, you may return it within 30 days of the delivery date for a full refund or exchange.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
              To be eligible for a return, items must be largely unused (more than 75% full) and returned in their original packaging. Please note that original shipping charges are non-refundable.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              To initiate a return, simply contact our concierge team at <strong>concierge@elvaraskinlane.com</strong> with your order number. We will provide you with a prepaid return label and detailed instructions.
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-4 border-b border-outline-variant/30 pb-2">Damaged or Incorrect Items</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              If your order arrives damaged, or if you receive an incorrect item, please contact us within 48 hours of delivery. Include your order number and photographs of the damaged product or packaging. We will swiftly arrange a replacement at no additional cost to you.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
