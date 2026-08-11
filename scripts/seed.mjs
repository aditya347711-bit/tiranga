import dns from "dns";
import mongoose from "mongoose";

// Set public DNS servers to resolve MongoDB SRV records reliably
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers:", e);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("No MONGODB_URI found in environment variables!");
  process.exit(1);
}

const cardSchema = new mongoose.Schema(
  {
    name: String,
    idNo: String,
    address: String,
    photo: String,
  },
  { timestamps: true }
);

const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);

const sampleCards = [
  {
    name: "Rahul Sharma",
    idNo: "IND-2026-1001",
    address: "Block B, Sector 62, Noida, Uttar Pradesh",
    photo: null,
  },
  {
    name: "Priya Singh",
    idNo: "IND-2026-1002",
    address: "Connaught Place, New Delhi",
    photo: null,
  },
  {
    name: "Amit Patel",
    idNo: "IND-2026-1003",
    address: "SG Highway, Ahmedabad, Gujarat",
    photo: null,
  },
  {
    name: "Sunita Verma",
    idNo: "IND-2026-1004",
    address: "Main Road, Garhwa, Jharkhand",
    photo: null,
  },
  {
    name: "Rajesh Kumar",
    idNo: "IND-2026-1005",
    address: "MG Road, Bengaluru, Karnataka",
    photo: null,
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("Connected successfully!");

    console.log("Inserting sample ID card records...");
    const result = await Card.insertMany(sampleCards);
    console.log(`Successfully inserted ${result.length} sample cards into MongoDB!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error.message || error);
    process.exit(1);
  }
}

seed();
