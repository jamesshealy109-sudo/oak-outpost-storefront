import test from "node:test";
import assert from "node:assert/strict";
import { validateContact, validateNewsletter } from "../lib/forms";
test("contact accepts a useful message and rejects missing fields or malformed email", () => {
  const valid = {
    name: "Oak Customer",
    email: "customer@example.com",
    subject: "Size question",
    message: "How does this fit?",
    order: "OO-123",
  };
  assert.equal(validateContact(valid).order, "OO-123");
  for (const data of [
    { ...valid, email: "not-email" },
    { ...valid, name: "" },
    { ...valid, subject: "" },
    { ...valid, message: "x".repeat(5001) },
  ])
    assert.throws(() => validateContact(data));
});
test("newsletter requires explicit consent and a valid email", () => {
  assert.throws(
    () => validateNewsletter({ email: "customer@example.com" }),
    /consent/i,
  );
  assert.throws(
    () => validateNewsletter({ email: "invalid", consent: true }),
    /email/i,
  );
  assert.equal(
    validateNewsletter({ email: " Customer@Example.com ", consent: true }),
    "customer@example.com",
  );
});
