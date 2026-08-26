const SIGNALS = [
  { type: "CAPTCHA", pattern: /captcha|verify you are human|security check/i },
  { type: "SMS_CODE", pattern: /verification code|text message|sms code/i },
  { type: "EMAIL_VERIFICATION", pattern: /check your email|email verification|verify your email/i },
  { type: "SIGN_IN", pattern: /sign in to continue|log in to continue/i },
];

export function classifyManualAction(text, url = "") {
  const haystack = `${url}\n${text}`;
  return SIGNALS.find(({ pattern }) => pattern.test(haystack))?.type ?? null;
}

export async function detectManualAction(page) {
  const text = await page.locator("body").innerText().catch(() => "");
  return classifyManualAction(text, page.url());
}

export async function findUnansweredRequiredFields(page) {
  return page.locator(
    'input[required]:visible, textarea[required]:visible, select[required]:visible, [aria-required="true"]:visible',
  ).evaluateAll((elements) =>
    elements
      .filter((element) => {
        if (element.type === "checkbox" || element.type === "radio") return !element.checked;
        return !String(element.value ?? "").trim();
      })
      .map((element) =>
        element.getAttribute("aria-label") || element.labels?.[0]?.innerText ||
        element.name || element.id || "unknown required field",
      ),
  );
}
