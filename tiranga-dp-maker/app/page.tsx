"use client";

import React, { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";

/* ─── Types ────────────────────────────────────────────────────────────────── */
type FrameType = "circle" | "square" | "poster";

/* ─── Ashoka Chakra SVG ─────────────────────────────────────────────────────── */
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
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill="none" stroke="#000080" strokeWidth={size * 0.04} />
            <circle cx={size / 2} cy={size / 2} r={size * 0.12} fill="#000080" />
            {spokes.map((s, i) => (
                <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                    stroke="#000080" strokeWidth={size * 0.025} strokeLinecap="round" />
            ))}
        </svg>
    );
}

/* ─── India Flag SVG ─────────────────────────────────────────────────────── */
function IndiaFlag({ width = 36, height = 24 }: { width?: number; height?: number }) {
    const r = height / 6;
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ borderRadius: 3, flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }}>
            {/* Saffron */}
            <rect x={0} y={0} width={width} height={height / 3} fill="#FF9933" />
            {/* White */}
            <rect x={0} y={height / 3} width={width} height={height / 3} fill="#FFFFFF" />
            {/* Green */}
            <rect x={0} y={(height / 3) * 2} width={width} height={height / 3} fill="#138808" />
            {/* Ashoka Chakra */}
            <circle cx={width / 2} cy={height / 2} r={r} fill="none" stroke="#000080" strokeWidth={r * 0.22} />
            <circle cx={width / 2} cy={height / 2} r={r * 0.18} fill="#000080" />
            {Array.from({ length: 24 }, (_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                return (
                    <line
                        key={i}
                        x1={width / 2 + Math.cos(rad) * r * 0.16}
                        y1={height / 2 + Math.sin(rad) * r * 0.16}
                        x2={width / 2 + Math.cos(rad) * r * 0.88}
                        y2={height / 2 + Math.sin(rad) * r * 0.88}
                        stroke="#000080" strokeWidth={r * 0.1} strokeLinecap="round"
                    />
                );
            })}
        </svg>
    );
}

/* ─── Frame Previews ──────────────────────────────────────────────────────── */

function CircleDP({ photoSrc }: { photoSrc: string | null }) {
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "conic-gradient(#FF9933 0deg 120deg, #ffffff 120deg 240deg, #138808 240deg 360deg)",
                padding: 14,
                boxShadow: "0 8px 40px rgba(255,153,51,0.35), 0 0 0 3px rgba(255,153,51,0.15)",
            }}>
                <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    background: "#f8f8f8",
                    overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #fff",
                }}>
                    {photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoSrc} alt="DP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#ccc" }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span style={{ fontSize: 12, color: "#aaa" }}>Upload Photo</span>
                        </div>
                    )}
                </div>
            </div>
            <div style={{
                position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)",
                background: "#fff", borderRadius: "50%", padding: 5,
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}>
                <AshokaChakra size={28} />
            </div>
        </div>
    );
}

function SquareDP({ photoSrc, userName }: { photoSrc: string | null; userName: string }) {
    return (
        <div style={{ position: "relative", width: 300, height: 300 }}>
            <div style={{
                position: "absolute", inset: 0,
                border: "8px solid #FF9933",
                borderRadius: 16,
                background: "#fff",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(255,153,51,0.2)",
            }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, display: "flex" }}>
                    <div style={{ flex: 1, background: "#FF9933" }} />
                    <div style={{ flex: 1, background: "#fff", borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }} />
                    <div style={{ flex: 1, background: "#138808" }} />
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 14, display: "flex" }}>
                    <div style={{ flex: 1, background: "#FF9933" }} />
                    <div style={{ flex: 1, background: "#fff", borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }} />
                    <div style={{ flex: 1, background: "#138808" }} />
                </div>
                <div style={{ position: "absolute", inset: "14px 0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" }}>
                    {photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoSrc} alt="DP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#ccc" }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span style={{ fontSize: 12, color: "#aaa" }}>Upload Photo</span>
                        </div>
                    )}
                </div>
            </div>
            {userName && (
                <div style={{
                    position: "absolute", bottom: -34, left: "50%", transform: "translateX(-50%)",
                    color: "#E65C00", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap",
                }}>
                    {userName}
                </div>
            )}
        </div>
    );
}

function PosterDP({ photoSrc, userName }: { photoSrc: string | null; userName: string }) {
    return (
        <div style={{
            position: "relative", width: 220, height: 320,
            background: "linear-gradient(175deg, #FFFBF5 0%, #FFF8EE 40%, #F1FBF1 100%)",
            borderRadius: 20,
            border: "2px solid rgba(255,153,51,0.35)",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
            boxShadow: "0 8px 32px rgba(255,153,51,0.18)",
        }}>
            {/* Thick tricolor top stripe */}
            <div style={{ display: "flex", height: 12 }}>
                <div style={{ flex: 1, background: "#FF9933" }} />
                <div style={{ flex: 1, background: "#FFFFFF", borderLeft: "1px solid #f0f0f0", borderRight: "1px solid #f0f0f0" }} />
                <div style={{ flex: 1, background: "#138808" }} />
            </div>
            {/* Title with flag */}
            <div style={{ textAlign: "center", padding: "8px 8px 4px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <IndiaFlag width={22} height={15} />
                <span style={{ color: "#CC5500", fontWeight: 800, fontSize: 12, letterSpacing: 0.8 }}>जय हिंद</span>
                <IndiaFlag width={22} height={15} />
            </div>
            {/* Circle photo */}
            <div style={{ display: "flex", justifyContent: "center", padding: "0 20px" }}>
                <div style={{
                    width: 130, height: 130, borderRadius: "50%",
                    border: "5px solid #FF9933",
                    overflow: "hidden",
                    background: "#f8f8f8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(255,153,51,0.25), 0 0 0 2px #fff",
                }}>
                    {photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoSrc} alt="DP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <svg width="40" height="40" fill="none" stroke="#ccc" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <AshokaChakra size={30} />
            </div>
            <div style={{ textAlign: "center", padding: "6px 12px 0", color: "#1A1A1A", fontWeight: 800, fontSize: 15 }}>
                {userName || "Your Name"}
            </div>
            {/* Har Ghar Tiranga with mini flags */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6 }}>
                <IndiaFlag width={16} height={11} />
                <span style={{ color: "#555", fontSize: 10, fontWeight: 600 }}>Har Ghar Tiranga</span>
                <IndiaFlag width={16} height={11} />
            </div>
            {/* Thick tricolor bottom stripe */}
            <div style={{ display: "flex", height: 12, marginTop: "auto" }}>
                <div style={{ flex: 1, background: "#FF9933" }} />
                <div style={{ flex: 1, background: "#FFFFFF", borderLeft: "1px solid #f0f0f0", borderRight: "1px solid #f0f0f0" }} />
                <div style={{ flex: 1, background: "#138808" }} />
            </div>
        </div>
    );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function Home() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [userName, setUserName] = useState("");
    const [frameType, setFrameType] = useState<FrameType>("circle");
    const [isDragging, setIsDragging] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

    const previewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const particles = [
        { color: "#FF9933", size: 8, top: "12%", left: "4%" },
        { color: "#138808", size: 6, top: "22%", right: "6%" },
        { color: "#FF9933", size: 10, bottom: "28%", left: "2%" },
        { color: "#138808", size: 5, top: "65%", right: "4%" },
        { color: "#FF9933", size: 7, bottom: "12%", right: "14%" },
        { color: "#000080", size: 5, top: "78%", left: "10%" },
    ];

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhoto(e.target?.result as string);
            setSaveStatus("idle");
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleDownload = useCallback(async () => {
        if (!previewRef.current) return;
        setIsDownloading(true);
        try {
            const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 3, skipFonts: true });
            // Download
            const link = document.createElement("a");
            link.download = `tiranga-dp-${frameType}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            // Auto-save to cloud silently
            setSaveStatus("idle");
            fetch("/api/dp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: userName || "Anonymous", frameType, processedPhoto: dataUrl }),
            })
                .then((r) => r.json())
                .then((d) => { if (d.url) setSaveStatus("saved"); })
                .catch(() => { /* silent fail */ });
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setIsDownloading(false);
        }
    }, [frameType, userName]);

    const frames: { type: FrameType; label: string; emoji: string; desc: string }[] = [
        { type: "circle", label: "Circle DP", emoji: "⭕", desc: "1:1 Round Profile" },
        { type: "square", label: "Square Frame", emoji: "🟧", desc: "Photo Frame" },
        { type: "poster", label: "Poster", emoji: "📜", desc: "Full Poster" },
    ];

    return (
        <div style={{ minHeight: "100vh", position: "relative", background: "#FAFAF8" }}>

            {/* Light particles */}
            {particles.map((p, i) => (
                <div key={i} className="particle" style={{
                    width: p.size, height: p.size,
                    background: p.color,
                    top: (p as { top?: string }).top,
                    left: (p as { left?: string }).left,
                    right: (p as { right?: string }).right,
                    bottom: (p as { bottom?: string }).bottom,
                    position: "fixed", opacity: 0.25, zIndex: 0,
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: `${3.5 + i * 0.4}s`,
                }} />
            ))}

            {/* Subtle background radials */}
            <div style={{
                position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse at 10% 10%, rgba(255,153,51,0.07) 0%, transparent 55%), radial-gradient(ellipse at 90% 90%, rgba(19,136,8,0.06) 0%, transparent 55%)",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                {/* Tricolor bar */}
                <div className="tricolor-bar" />

                {/* Header */}
                <header style={{
                    backgroundColor: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(16px)",
                    borderBottom: "1px solid rgba(255,153,51,0.18)",
                    padding: "12px 20px",
                    position: "sticky", top: 0, zIndex: 50,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="spin-slow" style={{ flexShrink: 0 }}>
                                <AshokaChakra size={38} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: "clamp(15px, 4vw, 22px)", fontWeight: 900, color: "#1A1A1A", letterSpacing: "-0.5px", lineHeight: 1.2, display: "flex", alignItems: "center", gap: 8 }}>
                                    <IndiaFlag width={32} height={22} />
                                    Tiranga DP Maker
                                </h1>
                                <p style={{ fontSize: "clamp(10px, 2.5vw, 12px)", color: "#FF9933", fontWeight: 600, marginTop: 2 }}>
                                    मेरा भारत, मेरी पहचान • Har Ghar Tiranga
                                </p>
                            </div>
                        </div>
                        <div style={{
                            padding: "5px 12px", borderRadius: 20,
                            background: "#FFF3E0", border: "1px solid rgba(255,153,51,0.4)",
                            color: "#E65C00", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                        }}>
                            Free • Instant • Private
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}
                    className="main-grid">
                    <style>{`
                        @media (max-width: 768px) { .main-grid { grid-template-columns: 1fr !important; } }
                    `}</style>

                    {/* ── Left: Controls ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* Upload */}
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h2 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ background: "#FFF3E0", borderRadius: 8, padding: "4px 10px", color: "#FF9933" }}>📸</span>
                                Upload Your Photo
                            </h2>
                            <div
                                id="upload-zone"
                                className={`upload-zone ${isDragging ? "drag-over" : ""}`}
                                style={{ padding: 32, textAlign: "center" }}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input id="photo-input" ref={fileInputRef} type="file" accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
                                {photo ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={photo} alt="Selected"
                                            style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "3px solid #FF9933", boxShadow: "0 4px 12px rgba(255,153,51,0.3)" }} />
                                        <span style={{ color: "#138808", fontSize: 13, fontWeight: 600 }}>✅ Photo selected — click to change</span>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: 36, marginBottom: 10 }}>📷</div>
                                        <p style={{ color: "#555", fontSize: 14, fontWeight: 500 }}>Drag & drop or click to upload</p>
                                        <p style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>JPG, PNG, WEBP — any size</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h2 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ background: "#FFF3E0", borderRadius: 8, padding: "4px 10px", color: "#FF9933" }}>✍️</span>
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
                                    background: "#FAFAF8",
                                    border: "1.5px solid rgba(255,153,51,0.3)",
                                    borderRadius: 12, color: "#1A1A1A",
                                    fontSize: 15, outline: "none",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                                onFocus={(e) => { e.target.style.borderColor = "#FF9933"; e.target.style.boxShadow = "0 0 0 3px rgba(255,153,51,0.12)"; }}
                                onBlur={(e) => { e.target.style.borderColor = "rgba(255,153,51,0.3)"; e.target.style.boxShadow = "none"; }}
                            />
                            <p style={{ color: "#aaa", fontSize: 11, marginTop: 6 }}>Shown on Square Frame & Poster styles</p>
                        </div>

                        {/* Frame Type */}
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h2 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ background: "#FFF3E0", borderRadius: 8, padding: "4px 10px", color: "#FF9933" }}>🖼️</span>
                                Choose Frame Style
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                {frames.map((f) => (
                                    <button key={f.type} id={`frame-${f.type}`}
                                        className={`frame-btn ${frameType === f.type ? "active" : ""}`}
                                        style={{ padding: "14px 8px" }}
                                        onClick={() => setFrameType(f.type)}
                                    >
                                        <div style={{ fontSize: 26, marginBottom: 6 }}>{f.emoji}</div>
                                        <div style={{ color: frameType === f.type ? "#E65C00" : "#333", fontWeight: 700, fontSize: 12 }}>{f.label}</div>
                                        <div style={{ color: "#aaa", fontSize: 10, marginTop: 3 }}>{f.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <button id="btn-download" className="btn-download"
                                onClick={handleDownload} disabled={!photo || isDownloading}>
                                {isDownloading ? "⏳ Generating..." : "⬇️ Download DP"}
                            </button>
                            {saveStatus === "saved" && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    background: "#E8F5E9", border: "1px solid #A5D6A7",
                                    borderRadius: 12, padding: "10px 16px",
                                    color: "#2E7D32", fontSize: 13, fontWeight: 600,
                                }}>
                                    <span>☁️ ✅ Auto-saved to cloud!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Preview ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div className="glass-card" style={{ padding: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <h2 style={{ color: "#1A1A1A", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginRight: 4 }}>
                                        <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#4ade80", opacity: 0.5, animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }} />
                                        <span style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                                    </span>
                                    Live Preview
                                </h2>
                                <span style={{
                                    fontSize: 11, color: "#888",
                                    background: "#F5F5F5", padding: "4px 10px",
                                    borderRadius: 8, fontFamily: "monospace",
                                    border: "1px solid #eee",
                                }}>
                                    {frameType === "circle" ? "1:1 Round" : frameType === "square" ? "1:1 Square" : "2:3 Poster"}
                                </span>
                            </div>

                            <div
                                className="preview-box"
                                style={{
                                    background: "linear-gradient(135deg, #FFF9F0 0%, #F0FFF4 100%)",
                                    borderRadius: 16, padding: 40,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    minHeight: 380, border: "1px solid rgba(255,153,51,0.12)",
                                    overflow: "hidden",
                                }}>
                                <div className="preview-scale-wrapper" ref={previewRef} style={{ display: "inline-block" }}>
                                    {frameType === "circle" && <CircleDP photoSrc={photo} />}
                                    {frameType === "square" && <SquareDP photoSrc={photo} userName={userName} />}
                                    {frameType === "poster" && <PosterDP photoSrc={photo} userName={userName} />}
                                </div>
                            </div>

                            <p style={{ textAlign: "center", color: "#bbb", fontSize: 12, marginTop: 14 }}>
                                Preview updates in real-time as you change settings
                            </p>
                        </div>

                        {/* Tips */}
                        <div className="glass-card" style={{ padding: 20, background: "#FFFBF5" }}>
                            <h3 style={{ color: "#E65C00", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💡 Tips for Best Result</h3>
                            <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {[
                                    "Use a clear, front-facing photo for best results",
                                    "Square or 1:1 photos work best for Circle & Square frames",
                                    "Portrait photos look great on the Poster frame",
                                    "Downloaded at 3× resolution for crisp quality",
                                ].map((tip, i) => (
                                    <li key={i} style={{ display: "flex", gap: 8, color: "#666", fontSize: 12 }}>
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
                    borderTop: "1px solid rgba(255,153,51,0.15)",
                    background: "#fff",
                    padding: "16px 20px",
                    textAlign: "center",
                    marginTop: 12,
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                        <IndiaFlag width={28} height={19} />
                        <span style={{ color: "#aaa", fontSize: 12 }}>
                            Made with <span style={{ color: "#e53935" }}>❤️</span> for India &nbsp;•&nbsp; जय हिंद
                        </span>
                        <span style={{ color: "#bbb", fontSize: 12 }}>•</span>
                        <a href="https://www.xpertbite.in" target="_blank" rel="noopener noreferrer"
                            style={{ color: "#FF9933", textDecoration: "none", fontWeight: 600, fontSize: 12 }}>
                            Xpertbite Technology
                        </a>
                        <IndiaFlag width={28} height={19} />
                    </div>
                </footer>
            </div>
        </div>
    );
}
