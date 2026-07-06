import type { Metadata } from "next";
import { Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
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
    <html lang="en" className="light">
      <head>
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@300,0,0,24&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${bodoni.variable} ${plusJakarta.variable} bg-background text-on-background font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container flex flex-col min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
