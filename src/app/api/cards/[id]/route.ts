import { NextResponse } from "next/server";
import { connectToDatabase, memoryStore } from "@/lib/db";
import Card from "@/models/Card";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

// GET /api/cards/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isConnected, mode } = await connectToDatabase();

    if (isConnected && mode === "mongodb") {
      const card = await Card.findById(id).lean();
      if (!card) {
        return NextResponse.json(
          { success: false, error: "Card record not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, mode: "mongodb", card });
    } else {
      const card = memoryStore.getById(id);
      if (!card) {
        return NextResponse.json(
          { success: false, error: "Card record not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, mode: "fallback", card });
    }
  } catch (error) {
    console.error("Error fetching card details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch card details" },
      { status: 500 }
    );
  }
}

// PUT /api/cards/[id] - Update card
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, idNo, address, phone, photo } = body;

    let photoUrl = photo;
    if (photo !== undefined) {
      photoUrl = await uploadImageToCloudinary(photo);
    }

    const { isConnected, mode } = await connectToDatabase();

    if (isConnected && mode === "mongodb") {
      const updatedCard = await Card.findByIdAndUpdate(
        id,
        {
          ...(name && { name: name.trim() }),
          ...(idNo && { idNo: idNo.trim() }),
          ...(address && { address: address.trim() }),
          ...(phone !== undefined && { phone: phone.trim() }),
          ...(photo !== undefined && { photo: photoUrl }),
        },
        { new: true, runValidators: true }
      );

      if (!updatedCard) {
        return NextResponse.json(
          { success: false, error: "Card not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        mode: "mongodb",
        card: updatedCard,
      });
    } else {
      const updatedCard = memoryStore.update(id, {
        ...(name && { name: name.trim() }),
        ...(idNo && { idNo: idNo.trim() }),
        ...(address && { address: address.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(photo !== undefined && { photo: photoUrl }),
      });

      if (!updatedCard) {
        return NextResponse.json(
          { success: false, error: "Card not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        mode: "fallback",
        card: updatedCard,
      });
    }
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update card" },
      { status: 500 }
    );
  }
}

// DELETE /api/cards/[id] - Delete card
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isConnected, mode } = await connectToDatabase();

    if (isConnected && mode === "mongodb") {
      const deletedCard = await Card.findByIdAndDelete(id);
      if (!deletedCard) {
        return NextResponse.json(
          { success: false, error: "Card not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Card deleted successfully",
      });
    } else {
      const success = memoryStore.delete(id);
      if (!success) {
        return NextResponse.json(
          { success: false, error: "Card not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Card deleted successfully",
      });
    }
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete card" },
      { status: 500 }
    );
  }
}
