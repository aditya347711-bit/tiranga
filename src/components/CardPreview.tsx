"use client";

import React, { forwardRef } from "react";
import { CardData } from "@/types/card";

interface CardPreviewProps {
  cardData: CardData;
}

// 24-spoke Navy Blue Ashoka Chakra SVG
export const AshokaChakraSvg: React.FC<{ className?: string; size?: number }> = ({
  className = "w-6 h-6",
  size = 24,
}) => {
  const spokes = Array.from({ length: 24 });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="#000080" strokeWidth="5" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#000080" strokeWidth="2" />
      <circle cx="50" cy="50" r="8" fill="#000080" />
      {spokes.map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x2 = Number((50 + 40 * Math.sin(rad)).toFixed(2));
        const y2 = Number((50 - 40 * Math.cos(rad)).toFixed(2));
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={x2}
            y2={y2}
            stroke="#000080"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
};

// Smart Card Gold IC Chip Component
const SmartChipSvg: React.FC = () => (
  <svg width="46" height="36" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="38" rx="6" fill="url(#chip-grad)" stroke="#B8860B" strokeWidth="1.5" />
    <path d="M0 12H14V26H0" stroke="#8B6508" strokeWidth="1.2" />
    <path d="M48 12H34V26H48" stroke="#8B6508" strokeWidth="1.2" />
    <path d="M14 0V12M14 26V38" stroke="#8B6508" strokeWidth="1.2" />
    <path d="M34 0V12M34 26V38" stroke="#8B6508" strokeWidth="1.2" />
    <rect x="18" y="12" width="12" height="14" rx="2" fill="#D4AF37" stroke="#8B6508" strokeWidth="1" />
    <defs>
      <linearGradient id="chip-grad" x1="0" y1="0" x2="48" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F6D365" />
        <stop offset="0.5" stopColor="#FDA085" />
        <stop offset="1" stopColor="#E6B980" />
      </linearGradient>
    </defs>
  </svg>
);

// High-Quality Waving Indian National Flag (Tiranga) SVG Graphic + PNG Image
const TirangaFlagGraphic: React.FC = () => (
  <div className="relative flex flex-col items-center justify-center">
    <div className="relative w-36 h-36 flex items-center justify-center">
      {/* eslint-disable-next-html-element-suppress */}
      <img
        src="/tiranga%20photo.png"
        alt="Tiranga Flag"
        className="w-full h-full object-contain filter drop-shadow-md"
      />
    </div>
  </div>
);

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ cardData }, ref) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(1);

    React.useEffect(() => {
      const updateScale = () => {
        if (wrapperRef.current) {
          const containerWidth = wrapperRef.current.clientWidth;
          if (containerWidth > 0 && containerWidth < 800) {
            setScale(Math.max(0.3, containerWidth / 800));
          } else {
            setScale(1);
          }
        }
      };

      updateScale();

      const observer = new ResizeObserver(() => {
        updateScale();
      });

      if (wrapperRef.current) {
        observer.observe(wrapperRef.current);
      }

      window.addEventListener("resize", updateScale);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateScale);
      };
    }, []);

    return (
      <div ref={wrapperRef} className="w-full flex flex-col items-center justify-center overflow-hidden py-1">
        <div
          style={{
            width: "800px",
            height: "500px",
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            marginBottom: `${-(500 * (1 - scale))}px`,
          }}
          className="transition-transform duration-75 ease-out"
        >
          {/* Standard Identity Card aspect ratio container (800px x 500px) */}
          <div
            ref={ref}
            id="identity-card-container"
            className="relative w-[800px] h-[500px] shrink-0 rounded-[22px] shadow-2xl overflow-hidden select-none bg-[#FFFDF7] border-[6px] border-[#D4AF37]"
            style={{
              boxShadow:
                "0 20px 40px -15px rgba(0, 0, 0, 0.35), inset 0 0 15px rgba(212, 175, 55, 0.25)",
            }}
          >
            {/* Inner Ornate Gold Border lines */}
            <div className="absolute inset-1.5 rounded-[16px] border-2 border-[#AA7C11]/50 pointer-events-none"></div>
            <div className="absolute inset-2.5 rounded-[12px] border border-[#D4AF37]/60 pointer-events-none"></div>

            {/* TOP TRICOLOR HEADER BAND */}
            <div className="relative w-full h-[88px] bg-gradient-to-r from-[#FF9933] via-[#FFAF54] to-[#FF8000] border-b-4 border-[#D4AF37] shadow-sm flex items-center justify-between px-6">
              {/* Ashoka Chakra & Title */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/95 shadow-md p-1 flex items-center justify-center border border-amber-300">
                  <AshokaChakraSvg size={36} />
                </div>
                <div className="flex flex-col text-left">
                  <h1
                    className="text-2xl font-extrabold tracking-wide uppercase text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
                    style={{
                      fontFamily: "'Tiro Devanagari Hindi', 'Poppins', sans-serif",
                    }}
                  >
                    मेरा भारत , मेरी पहचान
                  </h1>
                  <span className="text-[11px] font-bold text-amber-100 tracking-wider">
                    PERSONAL IDENTITY CARD • INDIAN PATRIOTIC EDITION
                  </span>
                </div>
              </div>

              {/* Subheader Badge with Tiranga photo.png */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#FFFDF5] border-2 border-[#D4AF37] shadow-md flex items-center gap-2.5">
                {/* eslint-disable-next-html-element-suppress */}
                <img
                  src="/tiranga%20photo.png"
                  alt="Tiranga Flag"
                  className="w-7 h-5 object-contain rounded drop-shadow-sm"
                />
                <span className="text-[#8B4500] text-xs font-black tracking-wide">
                  ★ गर्व से कहें – हम भारतीय हैं ★
                </span>
              </div>
            </div>

            {/* MAIN BODY AREA */}
            <div className="relative z-10 h-[342px] grid grid-cols-12 gap-4 items-center px-6 py-3">
              {/* LEFT: Framed Passport Photo (3 cols) */}
              <div className="col-span-3 flex flex-col items-center">
                <div className="relative w-[138px] h-[170px] rounded-xl p-1.5 bg-gradient-to-b from-[#FF9933] via-[#D4AF37] to-[#138808] shadow-lg">
                  <div className="w-full h-full rounded-lg bg-[#FFF9EA] overflow-hidden flex flex-col items-center justify-center text-center relative border-2 border-amber-300/80">
                    {cardData.photo ? (
                      // eslint-disable-next-html-element-suppress
                      <img
                        src={cardData.photo}
                        alt="User Identity Photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-amber-800/60 p-2">
                        <svg className="w-16 h-16 text-amber-700/50 mb-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="text-[11px] font-bold text-amber-900">
                          + फोटो जोड़ें
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CENTER: User Details (6 cols - Name, ID, Mobile, Address) */}
              <div className="col-span-6 flex flex-col space-y-2.5 text-slate-900 pr-2">
                {/* Name Field */}
                <div className="flex items-baseline gap-2 border-b-2 border-dashed border-amber-300/80 pb-1">
                  <span className="font-black text-base text-[#7A3E00] shrink-0">नाम :</span>
                  <span className="font-black text-lg text-[#0F172A] truncate tracking-wide">
                    {cardData.name || "______________________"}
                  </span>
                </div>

                {/* ID No Field */}
                <div className="flex items-baseline gap-2 border-b-2 border-dashed border-amber-300/80 pb-1">
                  <span className="font-black text-sm text-[#7A3E00] shrink-0">ID No. :</span>
                  <span className="font-mono font-black text-base text-amber-950 tracking-wider">
                    {cardData.idNo || "______________________"}
                  </span>
                </div>

                {/* Mobile No Field */}
                {cardData.phone && (
                  <div className="flex items-baseline gap-2 border-b-2 border-dashed border-amber-300/80 pb-1">
                    <span className="font-black text-sm text-[#7A3E00] shrink-0">मोबाइल :</span>
                    <span className="font-mono font-bold text-base text-slate-900 tracking-wider">
                      {cardData.phone}
                    </span>
                  </div>
                )}

                {/* Address Field */}
                <div className="flex items-start gap-2 border-b-2 border-dashed border-amber-300/80 pb-1">
                  <span className="font-black text-sm text-[#7A3E00] shrink-0">पता :</span>
                  <span className="font-bold text-xs text-slate-800 line-clamp-2 leading-tight">
                    {cardData.address || "____________________________________________"}
                  </span>
                </div>

                {/* Smart Card IC Chip & Motto */}
                <div className="pt-1 flex items-center gap-3">
                  <SmartChipSvg />
                  <div className="flex flex-col justify-center border-l-3 border-[#FF9933] pl-2.5">
                    <span className="text-[11px] font-black text-[#FF9933] uppercase tracking-wide leading-tight">
                      एक पहचान,
                    </span>
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide leading-tight">
                      एक देश,
                    </span>
                    <span className="text-[11px] font-black text-[#138808] uppercase tracking-wide leading-tight">
                      एक अभियान
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Tiranga photo.png Graphic (3 cols) */}
              <div className="col-span-3 flex flex-col items-center justify-center pl-2">
                <TirangaFlagGraphic />
              </div>
            </div>

            {/* BOTTOM EMERALD GREEN FOOTER RIBBON WITH SATYAMEVA JAYATE */}
            <div className="absolute bottom-0 left-0 right-0 h-[65px] bg-gradient-to-r from-[#0D5C06] via-[#138808] to-[#0A4A05] border-t-4 border-[#D4AF37] px-5 flex items-center justify-between text-white">
              {/* Left: Satyameva Jayate satya1.png */}
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-html-element-suppress */}
                <img
                  src="/satya1.png"
                  alt="Satyameva Jayate Emblem"
                  className="h-11 w-auto object-contain filter drop-shadow-md"
                />
                <div className="flex flex-col text-left">
                  <span
                    className="text-base font-black text-[#FFE082] tracking-wider uppercase drop-shadow-sm"
                    style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}
                  >
                    सत्यमेव जयते
                  </span>
                  <span className="text-[9px] text-emerald-100 font-semibold uppercase tracking-wider">
                    TRUTH ALONE TRIUMPHS
                  </span>
                </div>
              </div>

              {/* Center: National Motto Pill (Bright Warm Ivory/Gold Background) */}
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FFFDF5] via-[#FFF9EA] to-[#FFFDF5] border-2 border-[#D4AF37] text-[11px] font-black text-[#8B4500] shadow-md">
                {/* eslint-disable-next-html-element-suppress */}
                <img
                  src="/tiranga%20photo.png"
                  alt="Tiranga"
                  className="w-4.5 h-3.5 object-contain rounded-xs inline drop-shadow-sm"
                />
                <span className="tracking-wide">जय हिंद • Vande Mataram</span>
              </div>

              {/* Right: XpertBite Technology Branding */}
              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-[11px] font-bold text-amber-200 tracking-wide">
                    www.xpertbite.in
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-100 opacity-90">
                    Xpertbite Technology
                  </span>
                </div>
                {/* eslint-disable-next-html-element-suppress */}
                <img
                  src="/xpertbite_logo.png"
                  alt="XpertBite Logo"
                  className="h-8 w-auto object-contain bg-white/95 p-1 rounded-md shadow-sm border border-amber-300/40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CardPreview.displayName = "CardPreview";
