import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore DNS override errors in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
  // eslint-disable-next-line no-var
  var memoryCardStore: MemoryCardRecord[] | undefined;
}

export interface MemoryCardRecord {
  _id: string;
  name: string;
  idNo: string;
  address: string;
  phone?: string;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

if (!global.memoryCardStore) {
  global.memoryCardStore = [];
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; mode: "mongodb" | "fallback" }> {
  if (!MONGODB_URI || MONGODB_URI.trim() === "") {
    return { isConnected: false, mode: "fallback" };
  }

  if (cached.conn) {
    return { isConnected: true, mode: "mongodb" };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: true, mode: "mongodb" };
  } catch (e) {
    cached.promise = null;
    console.warn("MongoDB connection failed, falling back to memory store:", e);
    return { isConnected: false, mode: "fallback" };
  }
}

// In-Memory Storage Helpers (for seamless fallback when MONGODB_URI is not set yet)
export const memoryStore = {
  getAll: (): MemoryCardRecord[] => {
    return (global.memoryCardStore || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  getById: (id: string): MemoryCardRecord | undefined => {
    return (global.memoryCardStore || []).find((item) => item._id === id);
  },
  create: (data: Omit<MemoryCardRecord, "_id" | "createdAt" | "updatedAt">): MemoryCardRecord => {
    const newRecord: MemoryCardRecord = {
      _id: "mem_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    global.memoryCardStore = global.memoryCardStore || [];
    global.memoryCardStore.unshift(newRecord);
    return newRecord;
  },
  update: (id: string, data: Partial<Omit<MemoryCardRecord, "_id" | "createdAt">>): MemoryCardRecord | null => {
    const records = global.memoryCardStore || [];
    const index = records.findIndex((item) => item._id === id);
    if (index === -1) return null;
    const updated: MemoryCardRecord = {
      ...records[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    records[index] = updated;
    return updated;
  },
  delete: (id: string): boolean => {
    const records = global.memoryCardStore || [];
    const initialLen = records.length;
    global.memoryCardStore = records.filter((item) => item._id !== id);
    return global.memoryCardStore.length < initialLen;
  },
};
