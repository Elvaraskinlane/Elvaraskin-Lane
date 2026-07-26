import type { Metadata } from "next";
import { Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elvara Skinlane - Beauty that feels like you",
  description: "Elevating your daily skincare routine into a moment of pure, mindful luxury.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${bodoni.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Preconnect to Google Fonts to eliminate render-blocking */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background text-on-background font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container flex flex-col min-h-screen"
      >
        {children}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#fff',
              border: 'none',
              borderRadius: '0',
              padding: '16px 24px',
              fontFamily: 'var(--font-plus-jakarta)',
              fontSize: '13px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            },
          }}
        />
      </body>
    </html>
  );
}
