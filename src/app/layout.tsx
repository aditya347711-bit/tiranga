import type { Metadata } from "next";
import { Poppins, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const tiroHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: ["400"],
  variable: "--font-tiro-hindi",
});

export const metadata: Metadata = {
  title: "Indian Card Generator - मेरा भारत, मेरी पहचान",
  description: "Create and download your personalized high-resolution Indian identity card instantly in your browser.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${tiroHindi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
