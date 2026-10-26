import test from "node:test";
import assert from "node:assert/strict";
import { sameOrigin } from "../lib/request-origin";
test("accepts the browser origin against the incoming host, including a local preview", () => {
  assert.equal(sameOrigin("http://127.0.0.1:3100", "127.0.0.1:3100"), true);
  assert.equal(
    sameOrigin("https://shop.example.com", "shop.example.com"),
    true,
  );
  assert.equal(
    sameOrigin("https://attacker.example", "shop.example.com"),
    false,
  );
  assert.equal(sameOrigin(null, "shop.example.com"), false);
  assert.equal(sameOrigin("null", "shop.example.com"), false);
});
