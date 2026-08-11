"use client";

import React, { useState } from "react";
import { Download, Sparkles, CheckCircle2 } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";

import { CardData } from "@/types/card";

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
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

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

      // Save card details to database asynchronously
      if (cardData && cardData.name && cardData.idNo) {
        try {
          const res = await fetch("/api/cards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: cardData.name,
              idNo: cardData.idNo,
              address: cardData.address,
              phone: cardData.phone || "",
              photo: cardData.photo,
            }),
          });
          const data = await res.json();
          if (data.success) {
            setSaveStatus(
              data.mode === "mongodb"
                ? "Saved to MongoDB database!"
                : "Saved to database!"
            );
          }
        } catch (dbErr) {
          console.warn("Could not auto-save card to database:", dbErr);
        }
      }

      setDownloadSuccess(true);
      triggerConfetti();

      setTimeout(() => {
        setDownloadSuccess(false);
        setSaveStatus(null);
      }, 4000);
    } catch (err) {
      console.error("Failed to generate card image:", err);
      alert("Could not generate high-resolution image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className={`relative w-full max-w-md py-4 px-8 rounded-2xl font-bold text-lg text-white shadow-xl transition-all flex items-center justify-center gap-3 overflow-hidden ${
          isDownloading
            ? "bg-slate-700 cursor-not-allowed opacity-80"
            : downloadSuccess
            ? "bg-emerald-600 hover:bg-emerald-700 scale-[1.02]"
            : "bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {/* Glow backdrop line */}
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>

        {isDownloading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating High-Res Card...</span>
          </>
        ) : downloadSuccess ? (
          <>
            <CheckCircle2 className="w-6 h-6 text-white animate-bounce" />
            <span>Card Downloaded Successfully!</span>
          </>
        ) : (
          <>
            <Download className="w-6 h-6 animate-pulse" />
            <span>Download Card / कार्ड डाउनलोड करें</span>
            <Sparkles className="w-5 h-5 text-amber-200" />
          </>
        )}
      </button>

      {saveStatus && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{saveStatus}</span>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        ✨ High-Resolution Card Export ($2000 \times 1250$px)
      </p>
    </div>
  );
};
