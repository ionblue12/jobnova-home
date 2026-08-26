import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { decryptJson, encryptJson } from "../../lib/encryption.js";

test("session storage state encrypts and decrypts", () => {
  process.env.SESSION_ENCRYPTION_KEY = crypto.randomBytes(32).toString("base64");
  const value = { cookies: [{ name: "session", value: "secret" }], origins: [] };
  const encrypted = encryptJson(value);
  assert.equal(encrypted.includes("secret"), false);
  assert.deepEqual(decryptJson(encrypted), value);
});

test("tampering is rejected", () => {
  process.env.SESSION_ENCRYPTION_KEY = crypto.randomBytes(32).toString("base64");
  const envelope = JSON.parse(encryptJson({ cookies: [] }));
  envelope.data = `${envelope.data.slice(0, -2)}AA`;
  assert.throws(() => decryptJson(JSON.stringify(envelope)));
});
