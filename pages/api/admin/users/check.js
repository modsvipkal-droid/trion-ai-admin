import { findUserByEmail } from "../../../../lib/db";
import { sanitizeEmail } from "@/lib/validate";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = sanitizeEmail(req.query.email);
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await findUserByEmail(email);

    return res.status(200).json({
      unlimited: user?.unlimited || false,
      found: !!user,
    });
  } catch {
    return res.status(200).json({ unlimited: false, found: false });
  }
}
