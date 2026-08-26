import { prisma } from "@/lib/prisma";

const PROFILE_FIELDS = [
  "firstName", "lastName", "email", "phone", "currentTitle", "location",
  "resumePath", "yearsExperience", "workExperience", "education", "jobPreferences",
];

export async function GET() {
  return Response.json(await prisma.candidateProfile.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(request) {
  const body = await request.json();
  for (const field of ["firstName", "lastName", "email", "phone"]) {
    if (!body[field]) return Response.json({ error: `${field} is required` }, { status: 400 });
  }
  const data = Object.fromEntries(PROFILE_FIELDS.filter((field) => body[field] !== undefined)
    .map((field) => [field, body[field]]));
  return Response.json(await prisma.candidateProfile.create({ data }), { status: 201 });
}
