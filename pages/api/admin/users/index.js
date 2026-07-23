import { getUsers, findUserByEmail, insertUser } from "../../../../lib/db";
import { sanitizeEmail, sanitizeString } from "@/lib/validate";
import { logSecurityEvent } from "@/lib/securityLog";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await getUsers();
      return res.status(200).json({ users: Array.isArray(users) ? users : [] });
    } catch {
      return res.status(200).json({ users: [] });
    }
  }

  if (req.method === "POST") {
    try {
      const { email, displayName, photoURL } = req.body || {};
      const safeEmail = sanitizeEmail(email);
      if (!safeEmail) {
        return res.status(400).json({ error: "Valid email is required" });
      }

      const existing = await findUserByEmail(safeEmail);
      if (existing) {
        return res.status(200).json({ user: existing });
      }

      const user = {
        email: safeEmail,
        displayName: sanitizeString(displayName || safeEmail.split("@")[0], 100),
        photoURL: sanitizeString(photoURL || "", 500),
        unlimited: false,
        unlimitedAt: null,
        createdAt: Date.now(),
      };

      await insertUser(user);
      return res.status(201).json({ user });
    } catch {
      return res.status(200).json({ user: null, error: "Failed to create user" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
