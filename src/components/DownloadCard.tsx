"use client";

import React, { useState } from "react";
import { Download, Sparkles, CheckCircle2, ExternalLink } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";

import { CardData } from "@/types/card";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface DownloadCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  userName: string;
  cardData?: CardData;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({
  cardRef,
  userName,
  cardData,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF9933", "#FFFFFF", "#138808", "#D4AF37", "#000080"],
      });
    } catch {
      // Ignore confetti errors if blocked
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) {
      alert("Card preview is not ready yet. Please wait a moment.");
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      // Give images/fonts a tiny moment to stabilize if needed
      await new Promise((res) => setTimeout(res, 150));

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5, // Generates high-res ~2000x1250 PNG
        cacheBust: true,
      });

      // Create sanitized filename
      const cleanName = userName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-") || "card";
      const filename = `my-identity-card-${cleanName}.png`;

      // Trigger automatic browser download
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Save card details to database asynchronously in background
      if (cardData && cardData.name) {
        try {
          await fetch("/api/cards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: cardData.name,
              idNo: cardData.idNo || "IND-2026-7890",
              address: cardData.address,
              phone: cardData.phone || "",
              photo: cardData.photo,
            }),
          });
        } catch (dbErr) {
          console.warn("Could not auto-save card to database:", dbErr);
        }
      }

      setDownloadSuccess(true);
      triggerConfetti();

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Failed to generate card image:", err);
      alert("Could not generate high-resolution image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3.5 w-full">
      {/* Compact Download Button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className={`relative w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white shadow-md transition-all flex items-center justify-center gap-2 overflow-hidden ${
          isDownloading
            ? "bg-slate-700 cursor-not-allowed opacity-80"
            : downloadSuccess
            ? "bg-emerald-600 hover:bg-emerald-700 scale-[1.01]"
            : "bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
        }`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>

        {isDownloading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating...</span>
          </>
        ) : downloadSuccess ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
            <span>Downloaded!</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download Card</span>
          </>
        )}
      </button>

      {/* Prominent EasyLike.in Booster Button (Top Middle Logo & Properly Arranged Text) */}
      <a
        href="https://easylike.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full py-4 px-5 rounded-2xl text-white shadow-xl transition-all flex flex-col items-center justify-center text-center gap-2.5 overflow-hidden bg-black hover:bg-slate-900 border-2 border-amber-400/50 hover:border-amber-400 hover:scale-[1.01] active:scale-[0.99] group"
      >
        {/* Top Middle Logo Badge */}
        <div className="flex items-center justify-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 shadow-inner">
          <InstagramIcon className="w-5 h-5 text-pink-500 drop-shadow" />
          <FacebookIcon className="w-5 h-5 text-blue-500 drop-shadow" />
        </div>

        {/* Properly Arranged Centered Text */}
        <div className="flex flex-col items-center gap-1 w-full">
          <p className="text-white font-extrabold text-base sm:text-lg leading-snug">
            Instagram & Facebook Followers, Likes, Views
          </p>
          <p className="text-amber-400 font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 group-hover:text-amber-300">
            <span>बढ़ाने के लिए यहाँ जाएं</span>
            <ExternalLink className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </p>
        </div>
      </a>
    </div>
  );
};
