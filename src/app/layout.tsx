import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
// @ts-ignore
import "./globals.css";

// Load Inter for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Load Playfair Display for the logo
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "LocalLink — Trade skills. Build community. No money needed.",
  description: "A hyperlocal skill-swapping platform. Offer what you know, learn what you don't.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}