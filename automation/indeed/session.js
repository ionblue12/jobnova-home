import { prisma } from "../../lib/prisma.js";
import { decryptJson, encryptJson } from "../../lib/encryption.js";

const PROVIDER = "indeed";

export async function loadSession(profileId) {
  const session = await prisma.browserSession.findUnique({
    where: { provider_profileId: { provider: PROVIDER, profileId } },
  });
  if (!session) return null;
  await prisma.browserSession.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() },
  });
  return decryptJson(session.encryptedData);
}

export async function saveSession(profileId, context) {
  const encryptedData = encryptJson(await context.storageState());
  await prisma.browserSession.upsert({
    where: { provider_profileId: { provider: PROVIDER, profileId } },
    create: { provider: PROVIDER, profileId, encryptedData, lastUsedAt: new Date() },
    update: { encryptedData, lastUsedAt: new Date() },
  });
}
