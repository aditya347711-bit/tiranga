"use client";

import React, { useRef } from "react";
import { X, Calendar, User, Hash, MapPin, Phone } from "lucide-react";
import { SavedCard } from "@/types/card";
import { CardPreview } from "@/components/CardPreview";
import { DownloadCard } from "@/components/DownloadCard";

interface CardDetailModalProps {
  card: SavedCard | null;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!card) return null;

  const formattedDate = new Date(card.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              Card Details & Live Render
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Record ID: <code className="font-mono">{card._id}</code>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Container */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Rendered Indian Identity Card:
          </h3>
          <div className="bg-slate-100/70 dark:bg-slate-950/70 p-2 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-x-auto w-full">
            <div className="w-full flex justify-center max-w-full">
              <CardPreview ref={cardRef} cardData={card} />
            </div>
          </div>
        </div>

        {/* Metadata & Photo Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-sm">
          {/* Photo Column */}
          <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <span className="text-xs font-semibold text-slate-400">Uploaded User Photo</span>
            {card.photo ? (
              // eslint-disable-next-html-element-suppress
              <img
                src={card.photo}
                alt={card.name}
                className="w-24 h-28 object-cover rounded-xl border-2 border-amber-500 shadow-md"
              />
            ) : (
              <div className="w-24 h-28 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700">
                No Photo
              </div>
            )}
          </div>

          {/* Details Column (2 cols) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-500" />
                Full Name
              </span>
              <p className="font-semibold text-slate-900 dark:text-white">
                {card.name}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-amber-500" />
                ID Number
              </span>
              <p className="font-semibold font-mono text-slate-900 dark:text-white">
                {card.idNo}
              </p>
            </div>

            {card.phone && (
              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  Phone Number
                </span>
                <p className="font-semibold font-mono text-slate-900 dark:text-white">
                  {card.phone}
                </p>
              </div>
            )}

            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Address
              </span>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {card.address}
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Created Timestamp
              </span>
              <p className="font-medium text-slate-700 dark:text-slate-300 text-xs font-mono">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-2">
          <DownloadCard cardRef={cardRef} userName={card.name} />
        </div>
      </div>
    </div>
  );
};
