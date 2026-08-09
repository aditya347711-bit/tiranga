"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, RefreshCw } from "lucide-react";

interface PhotoUploaderProps {
  photo: string | null;
  onPhotoChange: (photoDataUrl: string | null) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photo,
  onPhotoChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onPhotoChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        पासपोर्ट फोटो / Upload Photo <span className="text-amber-600">*</span>
      </label>

      {photo ? (
        <div className="relative group w-full max-w-[200px] h-48 rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {/* Photo preview */}
          {/* eslint-disable-next-html-element-suppress */}
          <img
            src={photo}
            alt="Uploaded card photo"
            className="w-full h-full object-cover"
          />

          {/* Action overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg transition-transform hover:scale-105"
              title="Replace Photo"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onPhotoChange(null)}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105"
              title="Remove Photo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 scale-[1.01]"
              : "border-slate-300 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-slate-800/50"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 text-center">
            Click or drag & drop photo here
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            JPG, PNG, WEBP (Max 10MB)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};
