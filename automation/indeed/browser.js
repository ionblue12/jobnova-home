import { chromium } from "playwright";

export async function openBrowser({ storageState, headless = true } = {}) {
  const channel = process.env.BROWSER_CHANNEL || undefined;
  const browser = await chromium.launch({ headless, channel });
  const context = await browser.newContext({
    storageState,
    locale: "en-US",
    viewport: { width: 1440, height: 1000 },
  });
  return { browser, context, page: await context.newPage() };
}

export async function closeBrowser({ browser, context }, beforeClose) {
  try {
    if (beforeClose) await beforeClose(context);
  } finally {
    await browser.close();
  }
}
