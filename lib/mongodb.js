import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "kalmods21_db";

if (typeof console !== "undefined") {
  console.log(`[mongodb] MONGODB_URI: ${MONGODB_URI ? "✓ set (" + MONGODB_URI.slice(0, 20) + "...)" : "✗ NOT SET"}`);
  console.log(`[mongodb] MONGODB_DB: ${MONGODB_DB}`);
}

let cached = globalThis.__tryonMongo;

if (!cached) {
  cached = globalThis.__tryonMongo = {
    client: null,
    db: null,
    promise: null,
    indexesReady: false,
  };
}

export async function getMongoClient() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
    cached.promise = client.connect();
  }

  cached.client = await cached.promise;
  return cached.client;
}

export async function getMongoDb() {
  if (cached.db) {
    return cached.db;
  }

  const client = await getMongoClient();
  cached.db = client.db(MONGODB_DB);
  return cached.db;
}

export async function ensureDeveloperIndexes() {
  const db = await getMongoDb();

  if (cached.indexesReady) {
    return db;
  }

  await Promise.all([
    db.collection("api_keys").createIndex({ keyHash: 1 }, { unique: true }),
    db.collection("api_keys").createIndex({ userId: 1, active: 1 }),
    db.collection("api_logs").createIndex({ keyHash: 1, timestamp: -1 }),
    db.collection("api_logs").createIndex({ userId: 1, timestamp: -1 }),
    db.collection("results_30s").createIndex({ period: 1 }, { unique: true }),
    db.collection("results_30s").createIndex({ blockTimestamp: -1 }),
  ]);

  cached.indexesReady = true;
  return db;
}
