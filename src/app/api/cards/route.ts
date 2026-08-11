import { NextResponse } from "next/server";
import { connectToDatabase, memoryStore } from "@/lib/db";
import Card from "@/models/Card";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

// GET /api/cards - List cards with optional search filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const { isConnected, mode } = await connectToDatabase();

    if (isConnected && mode === "mongodb") {
      let filter = {};
      if (query.trim()) {
        const regex = new RegExp(query.trim(), "i");
        filter = {
          $or: [{ name: regex }, { idNo: regex }, { address: regex }],
        };
      }

      const cards = await Card.find(filter).sort({ createdAt: -1 }).lean();
      return NextResponse.json({
        success: true,
        mode: "mongodb",
        cards,
        total: cards.length,
      });
    } else {
      // Fallback in-memory mode
      let cards = memoryStore.getAll();
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        cards = cards.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.idNo.toLowerCase().includes(q) ||
            c.address.toLowerCase().includes(q)
        );
      }
      return NextResponse.json({
        success: true,
        mode: "fallback",
        cards,
        total: cards.length,
      });
    }
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch card records" },
      { status: 500 }
    );
  }
}

// POST /api/cards - Create a new card record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, idNo, address, phone, photo } = body;

    if (!name || !idNo || !address) {
      return NextResponse.json(
        { success: false, error: "Name, ID Number, and Address are required." },
        { status: 400 }
      );
    }

    // Upload photo to Cloudinary CDN if photo is provided as base64
    const photoUrl = await uploadImageToCloudinary(photo);

    const { isConnected, mode } = await connectToDatabase();

    if (isConnected && mode === "mongodb") {
      const newCard = await Card.create({
        name: name.trim(),
        idNo: idNo.trim(),
        address: address.trim(),
        phone: phone ? phone.trim() : "",
        photo: photoUrl || null,
      });

      return NextResponse.json({
        success: true,
        mode: "mongodb",
        card: newCard,
      });
    } else {
      // Fallback in-memory mode
      const newCard = memoryStore.create({
        name: name.trim(),
        idNo: idNo.trim(),
        address: address.trim(),
        phone: phone ? phone.trim() : "",
        photo: photoUrl || null,
      });

      return NextResponse.json({
        success: true,
        mode: "fallback",
        card: newCard,
      });
    }
  } catch (error) {
    console.error("Error saving card record:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save card record" },
      { status: 500 }
    );
  }
}
