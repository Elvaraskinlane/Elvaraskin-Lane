import Image from "next/image";

export default function ContactInfo() {
  return (
    <div className="lg:col-span-5 flex flex-col gap-12 mt-12 lg:mt-0">
      {/* Information Block */}
      <div className="space-y-8">
        <div>
          <h3 className="font-label-md text-label-md text-on-surface mb-2 uppercase tracking-widest">Customer Care</h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Available Monday - Friday<br/>
            9:00 AM - 6:00 PM WAT<br/>
            <a href="tel:+2347067615908" className="hover:text-primary transition-colors">+234 706 761 5908</a>
          </p>
        </div>
        <div>
          <h3 className="font-label-md text-label-md text-on-surface mb-2 uppercase tracking-widest">Email</h3>
          <a href="mailto:elvaraskinlane@gmail.com" className="font-body-md text-body-md text-primary hover:text-tertiary transition-colors border-b border-transparent hover:border-tertiary pb-1">
            elvaraskinlane@gmail.com
          </a>
        </div>
        <div>
          <h3 className="font-label-md text-label-md text-on-surface mb-2 uppercase tracking-widest">Connect</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://www.instagram.com/elvaraskinlane" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-on-surface-variant hover:text-tertiary transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </a>
            <a href="https://wa.me/2347067615908" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-on-surface-variant hover:text-tertiary transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            </a>
          </div>
        </div>
      </div>

      {/* Atmospheric Image */}
      <div className="w-full aspect-[4/5] bg-surface-variant rounded overflow-hidden relative">
        <Image 
          src="/store-sign.jpg" 
          alt="Elvara Skinlane Flagship Store" 
          fill
          className="object-cover mix-blend-multiply opacity-90 transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
