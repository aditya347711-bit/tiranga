import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { uploadDpToCloudinary } from "@/lib/cloudinary";
import DP from "@/models/DP";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, frameType, processedPhoto } = body;

        if (!processedPhoto) {
            return NextResponse.json({ error: "No photo provided" }, { status: 400 });
        }

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadDpToCloudinary(processedPhoto, frameType || "circle");

        const { isConnected } = await connectToDatabase();

        if (isConnected) {
            const dp = await DP.create({
                name: name || "Anonymous",
                frameType: frameType || "circle",
                processedPhoto: cloudinaryUrl,
            });

            return NextResponse.json({
                success: true,
                id: dp._id.toString(),
                url: cloudinaryUrl,
            });
        }

        return NextResponse.json({
            success: true,
            url: cloudinaryUrl,
            warning: "DB not connected, but image uploaded to Cloudinary",
        });
    } catch (error) {
        console.error("Save DP error:", error);
        return NextResponse.json({ error: "Failed to save DP" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { isConnected } = await connectToDatabase();
        if (!isConnected) {
            return NextResponse.json({ dps: [] });
        }

        const dps = await DP.find({}).sort({ createdAt: -1 }).limit(50).lean();
        return NextResponse.json({
            dps: dps.map((d) => ({
                id: d._id.toString(),
                name: d.name,
                frameType: d.frameType,
                processedPhoto: d.processedPhoto,
                createdAt: d.createdAt,
            })),
        });
    } catch (error) {
        console.error("Fetch DPs error:", error);
        return NextResponse.json({ error: "Failed to fetch DPs" }, { status: 500 });
    }
}
