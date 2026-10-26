type Fields = Record<string, unknown>;
function field(data: Fields, key: string, max: number, required = true) {
  const value = typeof data[key] === "string" ? data[key].trim() : "";
  if ((required && !value) || value.length > max)
    throw new Error(
      `Please enter a valid ${key}${key === "message" ? " (up to 5,000 characters)" : ""}.`,
    );
  return value;
}
function email(value: unknown) {
  if (
    typeof value !== "string" ||
    value.trim().length > 254 ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  )
    throw new Error("Please enter a valid email address.");
  return value.trim().toLowerCase();
}
export function validateContact(data: Fields) {
  return {
    name: field(data, "name", 120),
    email: email(data.email),
    subject: field(data, "subject", 180),
    message: field(data, "message", 5000),
    order: field(data, "order", 80, false),
  };
}
export function validateNewsletter(data: Fields) {
  if (data.consent !== true)
    throw new Error("Please confirm your consent to receive emails.");
  return email(data.email);
}
const attempts = new Map<string, { count: number; until: number }>();
export function allowFormRequest(key: string): boolean {
  const now = Date.now();
  for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  const record = attempts.get(key);
  if (!record) {
    if (attempts.size > 5000) return false;
    attempts.set(key, { count: 1, until: now + 600000 });
    return true;
  }
  record.count++;
  return record.count <= 5;
}
