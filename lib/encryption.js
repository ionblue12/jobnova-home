import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getKey() {
  const encoded = process.env.SESSION_ENCRYPTION_KEY;
  if (!encoded) {
    throw new Error("SESSION_ENCRYPTION_KEY is required (32 random bytes, base64 encoded)");
  }

  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) {
    throw new Error("SESSION_ENCRYPTION_KEY must decode to exactly 32 bytes");
  }
  return key;
}

export function encryptJson(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);

  return JSON.stringify({
    v: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: ciphertext.toString("base64"),
  });
}

export function decryptJson(envelopeText) {
  const envelope = JSON.parse(envelopeText);
  if (envelope.v !== 1) throw new Error("Unsupported encrypted session format");

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(envelope.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(envelope.data, "base64")),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString("utf8"));
}
