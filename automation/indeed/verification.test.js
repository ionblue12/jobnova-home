import test from "node:test";
import assert from "node:assert/strict";
import { classifyManualAction } from "./verification.js";

test("recognizes checks that must never be automated", () => {
  assert.equal(classifyManualAction("Please verify you are human"), "CAPTCHA");
  assert.equal(classifyManualAction("Enter the SMS code"), "SMS_CODE");
  assert.equal(classifyManualAction("Check your email to continue"), "EMAIL_VERIFICATION");
});

test("ordinary application text is not a manual verification", () => {
  assert.equal(classifyManualAction("Review your application and continue"), null);
});
