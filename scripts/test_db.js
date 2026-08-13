const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dns = require("dns");

// Force Google DNS for SRV queries
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  console.log("DNS set error:", e.message);
}

const envPath = path.join(__dirname, "..", ".env.local");
let uri = "";
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  const match = content.match(/MONGODB_URI=(.+)/);
  if (match) {
    uri = match[1].trim();
  }
}

console.log("Testing connection with custom DNS (8.8.8.8)...");

async function test() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("SUCCESS! Connected to MongoDB Atlas.");
    process.exit(0);
  } catch (err) {
    console.error("CONNECTION ERROR WITH CUSTOM DNS:\n", err);
    process.exit(1);
  }
}

test();
