export default async function handler(req, res) {
  const hasUri = !!process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "kalmods21_db (default)";
  res.status(200).json({
    MONGODB_URI: hasUri ? "✓ set" : "✗ NOT SET",
    MONGODB_DB: dbName,
  });
}
