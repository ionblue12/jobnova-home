import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { prisma } from "../../lib/prisma.js";
import { captureLoginSession } from "./login.js";
import { discoverJobs } from "./search.js";
import { runApplication } from "./apply.js";

function option(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function required(name) {
  const value = option(name);
  if (!value) throw new Error(`Missing --${name}`);
  return value;
}

async function waitForEnter(message) {
  const readline = createInterface({ input, output });
  await readline.question(`${message}\n`);
  readline.close();
}

async function main() {
  const command = process.argv[2];
  if (command === "session") {
    await captureLoginSession(required("profile"), waitForEnter);
    console.log("Encrypted Indeed session saved.");
    return;
  }
  if (command === "manual") {
    const application = await prisma.application.findUniqueOrThrow({
      where: { id: required("application") }, include: { job: true },
    });
    await captureLoginSession(application.profileId, waitForEnter, application.job.url);
    console.log("Manual step completed and encrypted session saved. Rerun this application.");
    return;
  }
  if (command === "discover") {
    const jobs = await discoverJobs({
      profileId: required("profile"), query: required("query"),
      location: option("location", "remote"), limit: Number(option("limit", "5")),
    });
    console.table(jobs.map(({ id, title, company, matchScore }) => ({ id, title, company, matchScore })));
    return;
  }
  if (command === "run") {
    const result = await runApplication(required("application"), {
      submit: process.argv.includes("--submit"), headless: !process.argv.includes("--headed"),
    });
    console.log(`${result.id}: ${result.status}${result.manualAction ? ` (${result.manualAction})` : ""}`);
    return;
  }
  throw new Error("Command must be session, manual, discover, or run");
}

main()
  .catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
