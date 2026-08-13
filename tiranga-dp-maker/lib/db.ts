import mongoose from "mongoose";
import dns from "dns";

function configureDns() {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
        if (typeof dns.setDefaultResultOrder === "function") {
            dns.setDefaultResultOrder("ipv4first");
        }
    } catch {
        // Ignore DNS override errors in restricted environments
    }
}

configureDns();

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; mode: "mongodb" | "fallback" }> {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri || mongodbUri.trim() === "") {
        return { isConnected: false, mode: "fallback" };
    }

    if (cached.conn && mongoose.connection.readyState === 1) {
        return { isConnected: true, mode: "mongodb" };
    }

    configureDns();

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
        };

        cached.promise = mongoose.connect(mongodbUri, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
        return { isConnected: true, mode: "mongodb" };
    } catch (e) {
        cached.promise = null;
        console.warn("MongoDB connection failed:", e);
        return { isConnected: false, mode: "fallback" };
    }
}
