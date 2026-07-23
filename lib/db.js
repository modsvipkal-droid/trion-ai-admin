import fs from "fs";
import path from "path";
import { getMongoDb } from "./mongodb";

const DB_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DB_DIR, "users.json");
const ACTIVATIONS_FILE = path.join(DB_DIR, "activations.json");
const MAINTENANCE_FILE = path.join(DB_DIR, "maintenance.json");

function hasMongo() {
  return !!process.env.MONGODB_URI;
}

function ensureDir() {
  try { if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true }); } catch {}
}

function readJSON(file) {
  try { ensureDir(); if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  return [];
}

function writeJSON(file, data) {
  try { ensureDir(); fs.writeFileSync(file, JSON.stringify(data, null, 2)); } catch {}
}

function toPlain(doc) {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map((d) => toPlain(d));
  const { _id, ...rest } = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return rest;
}

export async function getUsers() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("users").find().sort({ createdAt: -1 }).toArray());
    } catch {}
  }
  const users = readJSON(USERS_FILE);
  return users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function findUserByEmail(email) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("users").findOne({ email }));
    } catch {}
  }
  const users = readJSON(USERS_FILE);
  return users.find((u) => u.email === email) || null;
}

export async function insertUser(user) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      const existing = await db.collection("users").findOne({ email: user.email });
      if (!existing) {
        await db.collection("users").insertOne({ ...user });
      }
      return user;
    } catch {}
  }
  const users = readJSON(USERS_FILE);
  if (!users.find((u) => u.email === user.email)) {
    users.unshift(user);
    writeJSON(USERS_FILE, users);
  }
  return user;
}

export async function updateUser(email, updates) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      const result = await db.collection("users").findOneAndUpdate(
        { email },
        { $set: updates },
        { returnDocument: "after" }
      );
      return toPlain(result);
    } catch {}
  }
  const users = readJSON(USERS_FILE);
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) return null;
  Object.assign(users[idx], updates);
  writeJSON(USERS_FILE, users);
  return users[idx];
}

export async function insertActivation(activation) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      await db.collection("activations").insertOne({ ...activation });
      return;
    } catch {}
  }
  const acts = readJSON(ACTIVATIONS_FILE);
  acts.unshift(activation);
  writeJSON(ACTIVATIONS_FILE, acts);
}

export async function getActivations() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("activations").find().sort({ activatedAt: -1 }).toArray());
    } catch {}
  }
  return readJSON(ACTIVATIONS_FILE);
}

export async function getMaintenance() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      const doc = await db.collection("maintenance").findOne({ _id: "config" });
      if (doc) return toPlain(doc);
      return { enabled: false, title: "", message: "", eta: "", updatedAt: null };
    } catch {}
  }
  const data = readJSON(MAINTENANCE_FILE);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { enabled: false, title: "", message: "", eta: "", updatedAt: null };
  }
  return data;
}

export async function updateMaintenance(config) {
  const data = {
    enabled: !!config.enabled,
    title: typeof config.title === "string" ? config.title : "",
    message: typeof config.message === "string" ? config.message : "",
    eta: typeof config.eta === "string" ? config.eta : "",
    updatedAt: Date.now(),
  };
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      await db.collection("maintenance").updateOne(
        { _id: "config" },
        { $set: data },
        { upsert: true }
      );
      return data;
    } catch {}
  }
  writeJSON(MAINTENANCE_FILE, data);
  return data;
}

export async function insertVisit(visit) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      await db.collection("visits").insertOne({ ...visit });
      const count = await db.collection("visits").countDocuments();
      if (count > 10000) {
        const oldest = await db.collection("visits").find().sort({ timestamp: 1 }).limit(count - 10000).toArray();
        if (oldest.length > 0) {
          await db.collection("visits").deleteMany({ _id: { $in: oldest.map((o) => o._id) } });
        }
      }
      return;
    } catch {}
  }
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  let visits = [];
  if (fs.existsSync(USERS_FILE.replace("users.json", "visits.json"))) {
    try { visits = JSON.parse(fs.readFileSync(path.join(DB_DIR, "visits.json"), "utf8")); } catch { visits = []; }
  }
  visits.push(visit);
  if (visits.length > 10000) visits = visits.slice(-10000);
  fs.writeFileSync(path.join(DB_DIR, "visits.json"), JSON.stringify(visits));
}

export async function getVisits() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("visits").find().toArray());
    } catch {}
  }
  const file = path.join(DB_DIR, "visits.json");
  if (fs.existsSync(file)) {
    try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  }
  return [];
}
