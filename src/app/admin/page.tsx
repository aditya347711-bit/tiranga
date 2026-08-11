"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Lock,
  Search,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Database,
  LayoutGrid,
  List,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  FileSpreadsheet,
  Info,
  ShieldCheck,
  X,
} from "lucide-react";
import { SavedCard } from "@/types/card";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CardDetailModal } from "@/components/admin/CardDetailModal";
import { EditCardModal } from "@/components/admin/EditCardModal";
import { AshokaChakraSvg } from "@/components/CardPreview";

export default function AdminPage() {
  // Passcode Protection state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Data states
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<"mongodb" | "fallback" | null>(null);
  const [hasMongoUri, setHasMongoUri] = useState<boolean>(false);
  const [stats, setStats] = useState<{ totalCards: number; todayCards: number }>({
    totalCards: 0,
    todayCards: 0,
  });

  // View & Modal states
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedCardForView, setSelectedCardForView] = useState<SavedCard | null>(null);
  const [selectedCardForEdit, setSelectedCardForEdit] = useState<SavedCard | null>(null);
  const [cardToDelete, setCardToDelete] = useState<SavedCard | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Check auth session on load
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("tiranga_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch cards & stats from API
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [cardsRes, statsRes] = await Promise.all([
        fetch(`/api/cards?q=${encodeURIComponent(searchQuery)}`),
        fetch("/api/stats"),
      ]);

      const cardsData = await cardsRes.json();
      const statsData = await statsRes.json();

      if (cardsData.success) {
        setCards(cardsData.cards || []);
        setMode(cardsData.mode);
      }

      if (statsData.success) {
        setHasMongoUri(statsData.hasMongoUri);
        setStats(statsData.stats || { totalCards: 0, todayCards: 0 });
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Handle PIN Unlock
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 123456
    if (pinInput.trim() === "123456" || pinInput.trim() === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("tiranga_admin_auth", "true");
      setPinError(null);
    } else {
      setPinError("Incorrect password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tiranga_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!cardToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/cards/${cardToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotification("Record deleted successfully!");
        setCards((prev) => prev.filter((c) => c._id !== cardToDelete._id));
        setStats((prev) => ({
          ...prev,
          totalCards: Math.max(0, prev.totalCards - 1),
        }));
        setCardToDelete(null);
        setTimeout(() => setNotification(null), 3000);
      } else {
        alert(data.error || "Failed to delete card record.");
      }
    } catch (err) {
      console.error("Error deleting card:", err);
      alert("Network error while deleting record.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export CSV
  const exportCSV = () => {
    if (cards.length === 0) {
      alert("No records to export!");
      return;
    }
    const headers = ["ID", "Name", "ID Number", "Phone", "Address", "Created Date"];
    const rows = cards.map((c) => [
      `"${c._id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.idNo.replace(/"/g, '""')}"`,
      `"${(c.phone || "").replace(/"/g, '""')}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      `"${new Date(c.createdAt).toLocaleString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `id_cards_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const exportJSON = () => {
    if (cards.length === 0) {
      alert("No records to export!");
      return;
    }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(cards, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `id_cards_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------------------------------------------------
  // MINIMAL PASSCODE LOCK SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          {pinError && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs text-center font-medium">
              {pinError}
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 text-center font-mono text-sm tracking-widest"
              autoFocus
            />

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors border border-slate-700"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      {/* Admin Header */}
      <AdminHeader
        mode={mode}
        hasMongoUri={hasMongoUri}
        onExportCSV={exportCSV}
        onExportJSON={exportJSON}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1 space-y-6">
        {/* Notification Toast */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white font-semibold text-sm shadow-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MongoDB Setup Banner (if in fallback mode) */}
        {mode === "fallback" && (
          <div className="bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  MongoDB Status: Operating in Local Fallback Buffer
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Your generated cards are currently saved in real-time memory. When you provide your MongoDB URL, simply paste it into <code className="bg-amber-200 dark:bg-amber-900/60 px-1.5 py-0.5 rounded font-mono text-[11px]">.env.local</code> as <code className="bg-amber-200 dark:bg-amber-900/60 px-1.5 py-0.5 rounded font-mono text-[11px]">MONGODB_URI=mongodb+srv://...</code> to enable permanent MongoDB cloud persistence!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Cards Saved
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {stats.totalCards}
              </span>
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Created Today
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {stats.todayCards}
              </span>
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Calendar className="w-5 h-5" />
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Database Engine
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {mode === "mongodb" ? "MongoDB Atlas" : "In-Memory Buffer"}
              </span>
              <span
                className={`p-2 rounded-xl ${
                  mode === "mongodb"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-600"
                }`}
              >
                <Database className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar (Search, Refresh, Layout Toggle) */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, ID, Address..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">
              Loading card records...
            </p>
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Card Records Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {searchQuery
                  ? `No records matching "${searchQuery}". Try clearing search filter.`
                  : "Generate and download ID cards on the main page to see records populated here!"}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW WITH MOBILE PHONE CARD FALLBACK */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Mobile Phone Card List (Visible on Phone screens < sm) */}
            <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {cards.map((card) => (
                <div key={card._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {card.photo ? (
                        <button
                          onClick={() => setSelectedCardForView(card)}
                          className="shrink-0 focus:outline-none"
                        >
                          {/* eslint-disable-next-html-element-suppress */}
                          <img
                            src={card.photo}
                            alt={card.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-sm"
                          />
                        </button>
                      ) : (
                        <div
                          onClick={() => setSelectedCardForView(card)}
                          className="w-12 h-12 rounded-xl bg-amber-500 text-white text-base font-bold flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
                        >
                          {card.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {card.name}
                        </h4>
                        <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold block">
                          {card.idNo}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setSelectedCardForView(card)}
                        className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300"
                        title="View Card"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedCardForEdit(card)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCardToDelete(card)}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="truncate max-w-[200px]">{card.address}</span>
                    <span className="font-mono text-[10px] shrink-0">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Visible on screens >= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Photo</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">ID Number</th>
                    <th className="py-3.5 px-4">Address</th>
                    <th className="py-3.5 px-4">Date Created</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {cards.map((card) => (
                    <tr
                      key={card._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4">
                        {card.photo ? (
                          <button
                            onClick={() => setSelectedCardForView(card)}
                            className="block focus:outline-none group relative"
                            title="Click to view card & image"
                          >
                            {/* eslint-disable-next-html-element-suppress */}
                            <img
                              src={card.photo}
                              alt={card.name}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400/70 shadow-sm group-hover:scale-105 transition-transform"
                            />
                          </button>
                        ) : (
                          <div
                            onClick={() => setSelectedCardForView(card)}
                            className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                            title="Click to view card"
                          >
                            {card.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {card.name}
                      </td>

                      {/* ID No */}
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 text-xs">
                        <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {card.idNo}
                        </span>
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {card.address}
                      </td>

                      {/* Date Created */}
                      <td className="py-3 px-4 text-xs font-mono text-slate-500">
                        {new Date(card.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCardForView(card)}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View / Render Card"
                          >
                            <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </button>
                          <button
                            onClick={() => setSelectedCardForEdit(card)}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>
                          <button
                            onClick={() => setCardToDelete(card)}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card) => (
              <div
                key={card._id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  {card.photo ? (
                    <button
                      onClick={() => setSelectedCardForView(card)}
                      className="focus:outline-none group shrink-0"
                      title="Click to view card & photo"
                    >
                      {/* eslint-disable-next-html-element-suppress */}
                      <img
                        src={card.photo}
                        alt={card.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/70 shadow-md group-hover:scale-105 transition-transform"
                      />
                    </button>
                  ) : (
                    <div
                      onClick={() => setSelectedCardForView(card)}
                      className="w-14 h-14 rounded-2xl bg-amber-500 text-white text-xl font-extrabold flex items-center justify-center shrink-0 shadow-md cursor-pointer hover:bg-amber-600 transition-colors"
                      title="Click to view card"
                    >
                      {card.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {card.name}
                    </h3>
                    <p className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {card.idNo}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {card.address}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedCardForView(card)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-100 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => setSelectedCardForEdit(card)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCardToDelete(card)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* View Card Detail & Preview Modal */}
      <CardDetailModal
        card={selectedCardForView}
        onClose={() => setSelectedCardForView(null)}
      />

      {/* Edit Card Modal */}
      <EditCardModal
        card={selectedCardForEdit}
        onClose={() => setSelectedCardForEdit(null)}
        onSave={(updated) => {
          setCards((prev) =>
            prev.map((c) => (c._id === updated._id ? updated : c))
          );
          setNotification("Card record updated successfully!");
          setTimeout(() => setNotification(null), 3000);
        }}
      />

      {/* Delete Confirmation Modal */}
      {cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Delete
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to delete the record for{" "}
              <strong className="text-slate-900 dark:text-white">
                {cardToDelete.name}
              </strong>{" "}
              ({cardToDelete.idNo})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCardToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
