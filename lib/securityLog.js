import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), ".security-logs");
const MAX_LOG_SIZE = 5 * 1024 * 1024;
const LOG_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function rotateLogIfNeeded(filePath) {
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > MAX_LOG_SIZE) {
      const rotated = `${filePath}.${Date.now()}`;
      fs.renameSync(filePath, rotated);
      setTimeout(() => {
        try { fs.unlinkSync(rotated); } catch { }
      }, LOG_RETENTION_MS);
    }
  } catch { }
}

export function logSecurityEvent(event, details = {}) {
  if (process.env.NODE_ENV !== "production") return;
  try {
    ensureLogDir();
    const date = new Date().toISOString().slice(0, 10);
    const filePath = path.join(LOG_DIR, `security-${date}.log`);
    rotateLogIfNeeded(filePath);
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      ...details,
    }) + "\n";
    fs.appendFileSync(filePath, entry, "utf8");
  } catch { }
}
