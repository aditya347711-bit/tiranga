"use client";

import React from "react";
import { PhotoUploader } from "./PhotoUploader";
import { CardData, DEFAULT_CARD_DATA } from "@/types/card";
import { Sparkles, Trash2 } from "lucide-react";

interface CardFormProps {
  cardData: CardData;
  onChange: (newData: CardData) => void;
}

export const CardForm: React.FC<CardFormProps> = ({ cardData, onChange }) => {
  const handleFieldChange = (field: keyof CardData, value: string | null) => {
    onChange({
      ...cardData,
      [field]: value,
    });
  };

  const handleFillSample = () => {
    onChange(DEFAULT_CARD_DATA);
  };

  const handleClear = () => {
    onChange({
      photo: null,
      name: "",
      idNo: "",
      address: "",
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
            कार्ड विवरण / Enter Details
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fill in your details below to see live card preview
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300/50 transition-all"
            title="Auto fill sample data"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Sample Data
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset form"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Photo Uploader */}
      <PhotoUploader
        photo={cardData.photo}
        onPhotoChange={(dataUrl) => handleFieldChange("photo", dataUrl)}
      />

      {/* Inputs */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
            नाम / Name <span className="text-amber-600">*</span>
          </label>
          <input
            type="text"
            value={cardData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="e.g. Anil Kumar"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all"
          />
        </div>

        {/* ID No */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
            ID No. / आईडी क्रमांक <span className="text-amber-600">*</span>
          </label>
          <input
            type="text"
            value={cardData.idNo}
            onChange={(e) => handleFieldChange("idNo", e.target.value)}
            placeholder="e.g. IND-2026-7890"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-mono transition-all"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
            पता / Address <span className="text-amber-600">*</span>
          </label>
          <textarea
            rows={3}
            value={cardData.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            placeholder="e.g. 123, भारत मार्ग, नई दिल्ली"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};
