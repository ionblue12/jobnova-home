import { existsSync } from "node:fs";
import { prisma } from "../../lib/prisma.js";
import { closeBrowser, openBrowser } from "./browser.js";
import { loadSession, saveSession } from "./session.js";
import { detectManualAction, findUnansweredRequiredFields } from "./verification.js";

async function updateApplication(id, data) {
  return prisma.application.update({ where: { id }, data });
}

async function pause(id, reason, currentStep) {
  return updateApplication(id, {
    status: "MANUAL_ACTION_REQUIRED",
    manualAction: reason,
    currentStep,
    error: null,
  });
}

async function fillIfEmpty(page, label, value) {
  if (!value) return;
  const input = page.getByLabel(label).first();
  if (await input.isVisible().catch(() => false)) {
    const current = await input.inputValue().catch(() => "");
    if (!current) await input.fill(String(value));
  }
}

async function fillKnownProfileFields(page, profile) {
  await fillIfEmpty(page, /first name/i, profile.firstName);
  await fillIfEmpty(page, /last name/i, profile.lastName);
  await fillIfEmpty(page, /email/i, profile.email);
  await fillIfEmpty(page, /phone/i, profile.phone);
  await fillIfEmpty(page, /city|location/i, profile.location);

  const upload = page.locator('input[type="file"]:visible').first();
  if (profile.resumePath && existsSync(profile.resumePath) &&
      await upload.isVisible().catch(() => false)) {
    await upload.setInputFiles(profile.resumePath);
  }
}

async function clickApplyFromJobPage(page, context) {
  const button = page.getByRole("button", { name: /apply now|easily apply|apply on indeed/i }).first();
  if (!await button.isVisible().catch(() => false)) return page;
  const popup = context.waitForEvent("page", { timeout: 3000 }).catch(() => null);
  await button.click();
  return (await popup) ?? page;
}

export async function runApplication(applicationId, { submit = false, headless = true } = {}) {
  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    include: { job: true, profile: true },
  });
  await updateApplication(applicationId, {
    status: "IN_PROGRESS",
    currentStep: "opening_job",
    manualAction: null,
    error: null,
    startedAt: application.startedAt ?? new Date(),
    lastAttemptAt: new Date(),
    attemptCount: { increment: 1 },
  });

  let handle;
  try {
    handle = await openBrowser({ storageState: await loadSession(application.profileId), headless });
    await handle.page.goto(application.job.url, { waitUntil: "domcontentloaded" });
    let page = await clickApplyFromJobPage(handle.page, handle.context);

    for (let step = 1; step <= 12; step += 1) {
      await page.waitForLoadState("domcontentloaded").catch(() => {});
      const manualAction = await detectManualAction(page);
      if (manualAction) return pause(applicationId, manualAction, `step_${step}`);

      const bodyText = await page.locator("body").innerText().catch(() => "");
      if (/application (?:has been )?submitted|application sent/i.test(bodyText)) {
        return updateApplication(applicationId, {
          status: "SUBMITTED", submittedAt: new Date(), currentStep: "complete",
          manualAction: null, error: null,
        });
      }

      await fillKnownProfileFields(page, application.profile);
      const required = await findUnansweredRequiredFields(page);
      if (required.length) {
        return pause(applicationId, `REQUIRED_FIELDS: ${required.join(", ")}`, `step_${step}`);
      }

      const submitButton = page.getByRole("button", { name: /submit(?: your)? application/i }).first();
      if (await submitButton.isVisible().catch(() => false)) {
        if (!submit) return pause(applicationId, "SUBMISSION_APPROVAL_REQUIRED", "review");
        await submitButton.click();
        await page.waitForLoadState("domcontentloaded").catch(() => {});
        continue;
      }

      const nextButton = page.getByRole("button", { name: /continue|next|review your application/i }).first();
      if (!await nextButton.isVisible().catch(() => false)) {
        return pause(applicationId, "UNRECOGNIZED_APPLICATION_STEP", `step_${step}`);
      }
      await nextButton.click();
    }
    return pause(applicationId, "APPLICATION_STEP_LIMIT_REACHED", "step_12");
  } catch (error) {
    await updateApplication(applicationId, {
      status: "FAILED", error: error.message, currentStep: "failed",
    });
    throw error;
  } finally {
    if (handle) {
      await closeBrowser(handle, (context) => saveSession(application.profileId, context));
    }
  }
}
