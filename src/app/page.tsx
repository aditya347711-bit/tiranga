"use client";

import React, { useRef, useState } from "react";
import { CardForm } from "@/components/CardForm";
import { CardPreview, AshokaChakraSvg } from "@/components/CardPreview";
import { DownloadCard } from "@/components/DownloadCard";
import { CardData, DEFAULT_CARD_DATA } from "@/types/card";
import { ShieldCheck, Heart } from "lucide-react";

export default function Home() {
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-amber-50/40 via-slate-50 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Top Tricolor Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-sm"></div>

      {/* Main Header */}
      <header className="py-6 px-4 border-b border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white shrink-0">
              <AshokaChakraSvg size={30} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                Indian Card Generator
              </h1>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Create your personalized card instantly • मेरा भारत, मेरी पहचान
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Patriotic Badge Tag */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 text-amber-900 dark:text-amber-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>100% Browser-Based Security & Privacy</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Main Application Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Input Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <CardForm cardData={cardData} onChange={setCardData} />
          </div>

          {/* Right Side: Live Card Preview & Download Action (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 lg:sticky lg:top-28">
            {/* Live Preview Card Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    लाइव कार्ड प्रीव्यू / Live Preview
                  </h2>
                </div>

                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  1600 × 1000 px
                </span>
              </div>

              {/* Card Rendering Container */}
              <div className="w-full overflow-hidden flex items-center justify-center p-1 sm:p-2 bg-slate-100/60 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <CardPreview ref={cardRef} cardData={cardData} />
              </div>
            </div>

            {/* Prominent Download Button */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-amber-300/40 dark:border-amber-900/40">
              <DownloadCard
                cardRef={cardRef}
                userName={cardData.name}
                cardData={cardData}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 px-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for India • जय हिंद 🇮🇳</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <span>Pure Client Side</span>
            <span>•</span>
            <a
              href="https://www.xpertbite.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
            >
              {/* eslint-disable-next-html-element-suppress */}
              <img
                src="/xpertbite_logo.png"
                alt="XpertBite"
                className="h-4 w-auto inline"
              />
              Xpertbite Technology (www.xpertbite.in)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
