import { NextResponse } from "next/server";
import { connectToDatabase, memoryStore } from "@/lib/db";
import Card from "@/models/Card";

export async function GET() {
  try {
    const { isConnected, mode } = await connectToDatabase();
    const hasMongoUri = Boolean(
      process.env.MONGODB_URI && process.env.MONGODB_URI.trim() !== ""
    );

    let totalCards = 0;
    let todayCards = 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    if (isConnected && mode === "mongodb") {
      totalCards = await Card.countDocuments();
      todayCards = await Card.countDocuments({
        createdAt: { $gte: startOfToday },
      });
    } else {
      const all = memoryStore.getAll();
      totalCards = all.length;
      todayCards = all.filter(
        (c) => new Date(c.createdAt).getTime() >= startOfToday.getTime()
      ).length;
    }

    return NextResponse.json({
      success: true,
      mode,
      isConnected,
      hasMongoUri,
      stats: {
        totalCards,
        todayCards,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
