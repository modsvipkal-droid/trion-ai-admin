export function sanitizeString(value, maxLength = 1000) {
  if (typeof value !== "string") return "";
  return value.replace(/[<>]/g, "").trim().slice(0, maxLength);
}

export function sanitizeEmail(email) {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase().replace(/[^\w@.+\-]/g, "").slice(0, 254);
}

export function sanitizeObject(obj, schema) {
  const result = {};
  for (const [key, rules] of Object.entries(schema)) {
    const value = obj[key];
    if (rules.required && (value === undefined || value === null || value === "")) {
      throw new ValidationError(`${key} is required`);
    }
    if (value === undefined || value === null) {
      result[key] = rules.default ?? undefined;
      continue;
    }
    switch (rules.type) {
      case "string":
        result[key] = typeof value === "string" ? value.trim().slice(0, rules.maxLength || 1000) : String(value).slice(0, rules.maxLength || 1000);
        if (rules.sanitize) result[key] = result[key].replace(rules.sanitize, "");
        break;
      case "number":
        result[key] = typeof value === "number" && Number.isFinite(value) ? value : Number(value);
        if (!Number.isFinite(result[key])) {
          throw new ValidationError(`${key} must be a valid number`);
        }
        if (rules.min !== undefined && result[key] < rules.min) throw new ValidationError(`${key} must be at least ${rules.min}`);
        if (rules.max !== undefined && result[key] > rules.max) throw new ValidationError(`${key} must be at most ${rules.max}`);
        break;
      case "boolean":
        result[key] = value === true || value === "true" || value === 1;
        break;
      case "array":
        result[key] = Array.isArray(value) ? value : [];
        if (rules.maxLength && result[key].length > rules.maxLength) {
          result[key] = result[key].slice(0, rules.maxLength);
        }
        break;
      case "object":
        result[key] = value && typeof value === "object" ? value : {};
        break;
      default:
        result[key] = value;
    }
  }
  return result;
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPeriod(period) {
  return /^\d{6,10}$/.test(String(period));
}

export function sanitizeMongoQuery(value) {
  if (typeof value === "string") {
    return value.replace(/[\${}()]/g, "").trim();
  }
  return value;
}
