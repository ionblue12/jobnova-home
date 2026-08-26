import { prisma } from "@/lib/prisma";

const ALLOWED_STATUSES = new Set([
  "PENDING", "IN_PROGRESS", "SUBMITTED", "FAILED", "MANUAL_ACTION_REQUIRED",
]);

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  if (!ALLOWED_STATUSES.has(body.status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }
  const application = await prisma.application.update({
    where: { id },
    data: {
      status: body.status,
      error: body.error ?? null,
      manualAction: body.manualAction ?? null,
      currentStep: body.currentStep,
      submittedAt: body.status === "SUBMITTED" ? new Date() : undefined,
    },
  });
  return Response.json(application);
}
