import { closeBrowser, openBrowser } from "./browser.js";
import { loadSession, saveSession } from "./session.js";
import { prisma } from "../../lib/prisma.js";

function scoreTitle(title, preferences = {}) {
  const keywords = preferences.keywords ?? [];
  const normalized = title.toLowerCase();
  if (!keywords.length) return null;
  return Math.round(
    (keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length /
      keywords.length) * 100,
  );
}

export async function discoverJobs({ profileId, query, location = "remote", limit = 5 }) {
  const profile = await prisma.candidateProfile.findUniqueOrThrow({ where: { id: profileId } });
  const handle = await openBrowser({ storageState: await loadSession(profileId) });
  try {
    const url = new URL("https://www.indeed.com/jobs");
    url.searchParams.set("q", query);
    url.searchParams.set("l", location);
    await handle.page.goto(url.toString(), { waitUntil: "domcontentloaded" });

    const found = await handle.page.locator('a[data-jk], a[href*="/viewjob?"]').evaluateAll(
      (links, max) => links.slice(0, max).map((link) => ({
        externalId: link.getAttribute("data-jk") || new URL(link.href).searchParams.get("jk"),
        title: link.getAttribute("aria-label") || link.innerText.trim(),
        url: link.href,
        company: link.closest(".job_seen_beacon")?.querySelector('[data-testid="company-name"]')?.textContent?.trim() || "Unknown",
        location: link.closest(".job_seen_beacon")?.querySelector('[data-testid="text-location"]')?.textContent?.trim() || null,
      })),
      limit,
    );

    return Promise.all(found.filter((job) => job.title && job.url).map((job) =>
      prisma.job.upsert({
        where: { url: job.url },
        create: { ...job, matchScore: scoreTitle(job.title, profile.jobPreferences ?? {}) },
        update: { title: job.title, company: job.company, location: job.location,
          externalId: job.externalId, matchScore: scoreTitle(job.title, profile.jobPreferences ?? {}) },
      }),
    ));
  } finally {
    await closeBrowser(handle, (context) => saveSession(profileId, context));
  }
}
