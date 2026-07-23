import { getActivations } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const history = await getActivations();
    return res.status(200).json({ history: Array.isArray(history) ? history : [] });
  } catch {
    return res.status(200).json({ history: [] });
  }
}
