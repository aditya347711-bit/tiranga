import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Tiranga DP Maker - Make Your Patriotic Profile Picture | जय हिंद",
    description:
        "Create stunning Tiranga-themed profile pictures with circle DP, square photo frame, or poster designs. Celebrate India with a patriotic avatar!",
    keywords: "tiranga dp maker, indian flag profile picture, patriotic dp, independence day, republic day, har ghar tiranga",
    openGraph: {
        title: "Tiranga DP Maker – Patriotic Profile Pictures",
        description: "Create stunning Tiranga DPs for Independence Day, Republic Day & more!",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
