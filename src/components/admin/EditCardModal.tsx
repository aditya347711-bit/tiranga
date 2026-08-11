"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { SavedCard } from "@/types/card";
import { PhotoUploader } from "@/components/PhotoUploader";

interface EditCardModalProps {
  card: SavedCard | null;
  onClose: () => void;
  onSave: (updatedCard: SavedCard) => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
  card,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    idNo: string;
    address: string;
    phone: string;
    photo: string | null;
  }>({
    name: "",
    idNo: "",
    address: "",
    phone: "",
    photo: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        idNo: card.idNo,
        address: card.address,
        phone: card.phone || "",
        photo: card.photo || null,
      });
      setError(null);
    }
  }, [card]);

  if (!card) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.idNo.trim() || !formData.address.trim()) {
      setError("Name, ID Number, and Address are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch(`/api/cards/${card._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success && result.card) {
        onSave(result.card);
        onClose();
      } else {
        setError(result.error || "Failed to update card record.");
      }
    } catch (err) {
      console.error("Error updating card:", err);
      setError("Network or server error while saving changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            Edit Card Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Uploader */}
          <PhotoUploader
            photo={formData.photo}
            onPhotoChange={(dataUrl) =>
              setFormData((prev) => ({ ...prev, photo: dataUrl }))
            }
          />

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* ID No */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ID Number *
            </label>
            <input
              type="text"
              value={formData.idNo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, idNo: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* Phone (Optional - 10 Digits Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number <span className="text-slate-400 font-normal">(Optional / 10 Digits)</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                setFormData((prev) => ({ ...prev, phone: onlyNums }));
              }}
              placeholder="e.g. 9876543210 (10 digits)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Address *
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
