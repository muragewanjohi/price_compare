import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Stripe Pricing API Tool",
  description: "Create and optimize your pricing pages with Stripe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <div className="fixed inset-0 flex justify-center pointer-events-none">
          <div className="w-[108rem] flex-none flex justify-end">
            <div className="w-[71.75rem] flex-none blur-[7rem] h-[40rem] bg-gradient-to-r from-blue-500/30 to-indigo-500/30 transform translate-x-[27rem] translate-y-[-10rem] rotate-[-60deg] opacity-50" />
            <div className="w-[90rem] flex-none blur-[7rem] h-[40rem] bg-gradient-to-r from-purple-500/30 to-pink-500/30 transform translate-x-[-40rem] translate-y-[-2rem] rotate-[-60deg] opacity-50" />
          </div>
        </div>
      </body>
    </html>
  );
}
