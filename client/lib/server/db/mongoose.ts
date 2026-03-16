import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

const globalCache = globalThis.__mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.__mongooseCache = globalCache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to client/.env.local");
  }

  if (!MONGODB_DB_NAME) {
    throw new Error("MONGODB_DB_NAME is missing. Add it to client/.env.local");
  }

  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
