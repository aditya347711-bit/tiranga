"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type FrameType = "circle" | "square" | "poster";

/* ─── Ashoka Chakra SVG ─────────────────────────────────────────────────── */
function AshokaChakra({ size = 40, className = "" }: { size?: number; className?: string }) {
    const r4 = (n: number) => Math.round(n * 10000) / 10000;
    const spokes = Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const r = size / 2;
        return {
            x1: r4(r + Math.cos(rad) * r * 0.15),
            y1: r4(r + Math.sin(rad) * r * 0.15),
            x2: r4(r + Math.cos(rad) * r * 0.9),
            y2: r4(r + Math.sin(rad) * r * 0.9),
        };
    });
    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={className}
        >
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill="none" stroke="#000080" strokeWidth={size * 0.04} />
            <circle cx={size / 2} cy={size / 2} r={size * 0.12} fill="#000080" />
            {spokes.map((s, i) => (
                <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#000080" strokeWidth={size * 0.025} strokeLinecap="round" />
            ))}
        </svg>
    );
}

/* ─── Frame Preview Components ───────────────────────────────────────────── */

// Circle DP Preview
function CircleDP({ photoSrc }: { photoSrc: string | null }) {
    return (
        <div style={{ position: "relative", width: 320, height: 320 }}>
            {/* Outer tricolor ring */}
            <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "conic-gradient(#FF9933 0deg 120deg, #fff 120deg 240deg, #138808 240deg 360deg)",
                padding: 6,
            }}>
                <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    background: "#1a1a2e",
                    overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoSrc} alt="DP" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)" }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span style={{ fontSize: 12 }}>Upload Photo</span>
                        </div>
                    )}
                </div>
            </div>
            {/* Chakra at bottom */}
            <div style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", borderRadius: "50%", padding: 4 }}>
                <AshokaChakra size={28} />
            </div>
        </div>
    );
}

// Square Frame Preview
function SquareDP({ photoSrc, userName }: { photoSrc: string | null; userName: string }) {
    return (
        <div style={{ position: "relative", width: 320, height: 320 }}>
            {/* Outer saffron border with corner chakras */}
            <div style={{
                position: "absolute", inset: 0,
                border: "8px solid #FF9933",
                borderRadius: 16,
                background: "#1a1a2e",
                overflow: "hidden",
            }}>
                {/* Top tricolor stripe */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, display: "flex" }}>
                    <div style={{ flex: 1, background: "#FF9933" }} />
                    <div style={{ flex: 1, background: "#fff" }} />
                    <div style={{ flex: 1, background: "#138808" }} />
                </div>
                {/* Bottom tricolor stripe */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 14, display: "flex" }}>
                    <div style={{ flex: 1, background: "#FF9933" }} />
                    <div style={{ flex: 1, background: "#fff" }} />
                    <div style={{ flex: 1, background: "#138808" }} />
                </div>
                {/* Photo area */}
                <div style={{ position: "absolute", inset: "14px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoSrc} alt="DP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.3)" }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span style={{ fontSize: 12 }}>Upload Photo</span>
                        </div>
                    )}
                </div>
            </div>
            {/* Name label */}
            {userName && (
                <div style={{
                    position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)",
                    color: "#FF9933", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap",
                    textShadow: "0 0 10px rgba(255,153,51,0.6)",
                }}>
                    {userName}
                </div>
            )}
        </div>
    );
}

// Poster Preview
function PosterDP({ photoSrc, userName }: { photoSrc: string | null; userName: string }) {
    return (
        <div style={{
            position: "relative", width: 240, height: 340,
            background: "linear-gradient(160deg, #0a0a1a 0%, #1a0a00 50%, #001a0a 100%)",
            borderRadius: 20,
            border: "2px solid rgba(255,153,51,0.4)",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
        }}>
            {/* Header tricolor */}
            <div style={{ display: "flex", height: 8 }}>
                <div style={{ flex: 1, background: "#FF9933" }} />
                <div style={{ flex: 1, background: "#fff" }} />
                <div style={{ flex: 1, background: "#138808" }} />
            </div>
            {/* Title */}
            <div style={{ textAlign: "center", padding: "10px 8px 6px", color: "#FF9933", fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>
                🇮🇳 जय हिंद 🇮🇳
            </div>
            {/* Circle photo */}
            <div style={{ display: "flex", justifyContent: "center", padding: "0 20px" }}>
                <div style={{
                    width: 140, height: 140, borderRadius: "50%",
                    border: "4px solid #FF9933",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoSrc} alt="DP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <svg width="40" height="40" fill="none" stroke="rgba(255,255,255,0.3)" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                </div>
            </div>
            {/* Chakra */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <AshokaChakra size={30} />
            </div>
            {/* Name */}
            <div style={{ textAlign: "center", padding: "8px 12px 0", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                {userName || "Your Name"}
            </div>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4 }}>
                Har Ghar Tiranga 🇮🇳
            </div>
            {/* Bottom tricolor */}
            <div style={{ display: "flex", height: 8, marginTop: "auto" }}>
                <div style={{ flex: 1, background: "#FF9933" }} />
                <div style={{ flex: 1, background: "#fff" }} />
                <div style={{ flex: 1, background: "#138808" }} />
            </div>
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function Home() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [userName, setUserName] = useState("");
    const [frameType, setFrameType] = useState<FrameType>("circle");
    const [isDragging, setIsDragging] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Floating particles
    const particles = [
        { color: "#FF9933", size: 8, top: "10%", left: "5%", delay: "0s" },
        { color: "#138808", size: 6, top: "20%", right: "8%", delay: "0.5s" },
        { color: "#FF9933", size: 10, bottom: "25%", left: "3%", delay: "1s" },
        { color: "#fff", size: 5, top: "60%", right: "5%", delay: "1.5s" },
        { color: "#138808", size: 7, bottom: "10%", right: "15%", delay: "0.8s" },
        { color: "#FF9933", size: 9, top: "80%", left: "12%", delay: "0.3s" },
    ];

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhoto(e.target?.result as string);
            setSaveStatus("idle");
            setShareUrl(null);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileSelect(file);
        },
        [handleFileSelect]
    );

    const handleDownload = useCallback(async () => {
        if (!previewRef.current) return;
        setIsDownloading(true);
        try {
            const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 3, skipFonts: true });
            const link = document.createElement("a");
            link.download = `tiranga-dp-${frameType}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setIsDownloading(false);
        }
    }, [frameType]);

    const handleSaveOnline = useCallback(async () => {
        if (!previewRef.current || !photo) return;
        setIsSaving(true);
        setSaveStatus("idle");
        try {
            const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2, skipFonts: true });
            const res = await fetch("/api/dp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: userName || "Anonymous", frameType, processedPhoto: dataUrl }),
            });
            const data = await res.json();
            if (data.url) {
                setShareUrl(data.url);
                setSaveStatus("saved");
            } else {
                setSaveStatus("error");
            }
        } catch {
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    }, [photo, userName, frameType]);

    const frames: { type: FrameType; label: string; emoji: string; desc: string }[] = [
        { type: "circle", label: "Circle DP", emoji: "⭕", desc: "1:1 Round Profile" },
        { type: "square", label: "Square Frame", emoji: "🟠", desc: "Photo Frame" },
        { type: "poster", label: "Poster", emoji: "📜", desc: "Full Poster" },
    ];

    return (
        <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
            {/* Animated background */}
            <div style={{
                position: "fixed", inset: 0, zIndex: 0,
                background: "radial-gradient(ellipse at 20% 20%, rgba(255,153,51,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(19,136,8,0.08) 0%, transparent 50%), #0a0a0f",
                pointerEvents: "none",
            }} />

            {/* Floating particles */}
            {particles.map((p, i) => (
                <div key={i} className="particle" style={{
                    width: p.size, height: p.size, background: p.color,
                    top: p.top, left: (p as { left?: string }).left, right: (p as { right?: string }).right,
                    bottom: (p as { bottom?: string }).bottom,
                    animationDelay: p.delay, animationDuration: `${3 + i * 0.5}s`,
                    position: "fixed", opacity: 0.4, zIndex: 0,
                }} />
            ))}

            {/* Content */}
            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Top tricolor bar */}
                <div className="tricolor-bar" />

                {/* Header */}
                <header style={{
                    backgroundColor: "rgba(10,10,15,0.85)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255,153,51,0.15)",
                    padding: "16px 24px",
                    position: "sticky", top: 0, zIndex: 50,
                }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div className="spin-slow">
                                <AshokaChakra size={44} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                                    🇮🇳 Tiranga DP Maker
                                </h1>
                                <p style={{ fontSize: 12, color: "rgba(255,153,51,0.8)", fontWeight: 500 }}>
                                    मेरा भारत, मेरी पहचान • Har Ghar Tiranga
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <div style={{
                                padding: "6px 14px", borderRadius: 20,
                                background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.3)",
                                color: "#FF9933", fontSize: 12, fontWeight: 600,
                            }}>
                                🎨 Free • Instant • Private
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}
                    className="main-grid">

                    <style>{`
            @media (max-width: 768px) {
              .main-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>

                    {/* Left Panel – Controls */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Upload Section */}
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h2 style={{ color: "#FF9933", fontWeight: 700, fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ background: "rgba(255,153,51,0.15)", borderRadius: 8, padding: "4px 8px" }}>📸</span>
                                Upload Your Photo
                            </h2>
                            <div
                                id="upload-zone"
                                className={`upload-zone ${isDragging ? "drag-over" : ""}`}
                                style={{ padding: 32, textAlign: "center", position: "relative" }}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    id="photo-input"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                />
                                {photo ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={photo} alt="Selected" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #FF9933" }} />
                                        <span style={{ color: "#FF9933", fontSize: 13, fontWeight: 600 }}>✅ Photo selected — click to change</span>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
                                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500 }}>
                                            Drag & drop or click to upload
                                        </p>
                                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 6 }}>
                                            JPG, PNG, WEBP — any size
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h2 style={{ color: "#FF9933", fontWeight: 700, fontSize: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ background: "rgba(255,153,51,0.15)", borderRadius: 8, padding: "4px 8px" }}>✍️</span>
                                Your Name (optional)
                            </h2>
                            <input
                                id="name-input"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="e.g. Aditya Kumar"
                                maxLength={40}
                                style={{
                                    width: "100%", padding: "12px 16px",
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,153,51,0.25)",
                                    borderRadius: 12, color: "#fff",
                                    fontSize: 15, outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#FF9933"}
                                onBlur={(e) => e.target.style.borderColor = "rgba(255,153,51,0.25)"}
                            />
                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 6 }}>
                                Shown on Square Frame & Poster styles
                            </p>
                        </div>

                        {/* Frame Type */}
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h2 style={{ color: "#FF9933", fontWeight: 700, fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ background: "rgba(255,153,51,0.15)", borderRadius: 8, padding: "4px 8px" }}>🖼️</span>
                                Choose Frame Style
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                {frames.map((f) => (
                                    <button
                                        key={f.type}
                                        id={`frame-${f.type}`}
                                        className={`frame-btn ${frameType === f.type ? "active" : ""}`}
                                        style={{ padding: "14px 10px", background: "rgba(255,255,255,0.03)", cursor: "pointer" }}
                                        onClick={() => setFrameType(f.type)}
                                    >
                                        <div style={{ fontSize: 26, marginBottom: 6 }}>{f.emoji}</div>
                                        <div style={{ color: frameType === f.type ? "#FF9933" : "#fff", fontWeight: 700, fontSize: 12 }}>{f.label}</div>
                                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 3 }}>{f.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <button
                                id="btn-download"
                                className="btn-download"
                                onClick={handleDownload}
                                disabled={!photo || isDownloading}
                            >
                                {isDownloading ? "⏳ Generating..." : "⬇️ Download DP"}
                            </button>
                            <button
                                id="btn-save-online"
                                onClick={handleSaveOnline}
                                disabled={!photo || isSaving}
                                style={{
                                    width: "100%", padding: "12px 24px",
                                    background: saveStatus === "saved" ? "rgba(19,136,8,0.2)" : "rgba(255,255,255,0.06)",
                                    border: `1px solid ${saveStatus === "saved" ? "#138808" : "rgba(255,153,51,0.2)"}`,
                                    borderRadius: 14, color: saveStatus === "saved" ? "#4ade80" : "#FF9933",
                                    fontWeight: 600, fontSize: 14, cursor: !photo || isSaving ? "not-allowed" : "pointer",
                                    transition: "all 0.3s", opacity: !photo || isSaving ? 0.5 : 1,
                                }}
                            >
                                {isSaving ? "☁️ Uploading..." : saveStatus === "saved" ? "✅ Saved to Cloud!" : "☁️ Save to Cloud"}
                            </button>

                            {shareUrl && (
                                <div style={{
                                    background: "rgba(19,136,8,0.1)", border: "1px solid rgba(19,136,8,0.3)",
                                    borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 6,
                                }}>
                                    <p style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>✅ Your DP is saved! Share it:</p>
                                    <input
                                        type="text"
                                        readOnly
                                        value={shareUrl}
                                        style={{
                                            width: "100%", background: "rgba(0,0,0,0.3)",
                                            border: "1px solid rgba(19,136,8,0.3)", borderRadius: 8,
                                            color: "rgba(255,255,255,0.7)", fontSize: 11, padding: "6px 10px",
                                        }}
                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel – Preview */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div className="glass-card" style={{ padding: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <h2 style={{ color: "#FF9933", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ position: "relative", display: "inline-flex" }}>
                                        <span style={{
                                            position: "absolute", inset: 0, borderRadius: "50%",
                                            background: "#4ade80", opacity: 0.4,
                                            animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
                                        }} />
                                        <span style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                                    </span>
                                    Live Preview
                                </h2>
                                <span style={{
                                    fontSize: 11, color: "rgba(255,255,255,0.4)",
                                    background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: 8,
                                    fontFamily: "monospace",
                                }}>
                                    {frameType === "circle" ? "1:1 Round" : frameType === "square" ? "1:1 Square" : "2:3 Poster"}
                                </span>
                            </div>

                            {/* Preview Container */}
                            <div style={{
                                background: "rgba(0,0,0,0.4)", borderRadius: 16,
                                padding: 32, display: "flex", alignItems: "center", justifyContent: "center",
                                minHeight: 380,
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}>
                                <div ref={previewRef} style={{ display: "inline-block" }}>
                                    {frameType === "circle" && <CircleDP photoSrc={photo} />}
                                    {frameType === "square" && <SquareDP photoSrc={photo} userName={userName} />}
                                    {frameType === "poster" && <PosterDP photoSrc={photo} userName={userName} />}
                                </div>
                            </div>

                            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 16 }}>
                                Preview updates in real-time as you change settings
                            </p>
                        </div>

                        {/* Tips */}
                        <div className="glass-card" style={{ padding: 20 }}>
                            <h3 style={{ color: "#FF9933", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💡 Tips for Best Result</h3>
                            <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {[
                                    "Use a clear, front-facing photo for best results",
                                    "Square or 1:1 photos work best for Circle & Square frames",
                                    "Portrait photos look great on the Poster frame",
                                    "Downloaded at 3× resolution for crisp quality",
                                ].map((tip, i) => (
                                    <li key={i} style={{ display: "flex", gap: 8, color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                                        <span style={{ color: "#FF9933", flexShrink: 0 }}>→</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer style={{
                    borderTop: "1px solid rgba(255,153,51,0.1)",
                    background: "rgba(0,0,0,0.3)",
                    padding: "20px 24px",
                    textAlign: "center",
                }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                            Made with ❤️ for India &nbsp;•&nbsp; जय हिंद 🇮🇳 &nbsp;•&nbsp;
                            <a href="https://www.xpertbite.in" target="_blank" rel="noopener noreferrer"
                                style={{ color: "#FF9933", textDecoration: "none" }}>
                                Xpertbite Technology
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
