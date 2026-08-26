import { closeBrowser, openBrowser } from "./browser.js";
import { loadSession, saveSession } from "./session.js";

export async function captureLoginSession(profileId, waitForUser, startUrl = "https://secure.indeed.com/auth") {
  const storageState = await loadSession(profileId);
  const handle = await openBrowser({ storageState, headless: false });
  try {
    await handle.page.goto(startUrl, {
      waitUntil: "domcontentloaded",
    });
    await waitForUser(
      "Create/sign in to your own account and complete any verification in the browser. Press Enter here when Indeed shows you are signed in.",
    );
  } finally {
    await closeBrowser(handle, (context) => saveSession(profileId, context));
  }
}
