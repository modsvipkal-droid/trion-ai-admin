import { listPayments, findPaymentByOrderId, deletePaymentByOrderId } from "../../../../lib/db";
import { logSecurityEvent } from "@/lib/securityLog";
import { createRateLimiter } from "@/lib/rateLimit";

const adminLimiter = createRateLimiter({ windowMs: 60000, max: 30, name: "admin-payments" });

export default async function handler(req, res) {
  const { limited } = adminLimiter(req, res);
  if (limited) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (req.method === "GET") {
    try {
      const payments = await listPayments();
      return res.status(200).json({ payments: Array.isArray(payments) ? payments : [] });
    } catch {
      return res.status(200).json({ payments: [] });
    }
  }

  if (req.method === "DELETE") {
    try {
      const orderId = String(req.query.orderId || "").trim();
      if (!orderId) {
        return res.status(400).json({ error: "orderId is required" });
      }
      const order = await findPaymentByOrderId(orderId);
      if (!order) {
        return res.status(404).json({ error: "Payment order not found" });
      }
      if (order.status === "VERIFIED") {
        return res.status(409).json({ error: "Verified orders cannot be deleted" });
      }
      await deletePaymentByOrderId(orderId);
      logSecurityEvent("admin_payment_deleted", { orderId, status: order.status });
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Failed to delete payment order" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}