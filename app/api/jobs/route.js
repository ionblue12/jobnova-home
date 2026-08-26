

import { prisma } from "@/lib/prisma";

export async function GET(){
    try{
        const jobs = await prisma.job.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        return Response.json(jobs);
    } catch (error) {
        console.error(error);

        return Response.json({
            error: "Failed to load jobs",
        },
        {
            status: 500,
        }
    );
    }
}

export async function POST(request) {
  const body = await request.json();
  for (const field of ["title", "company", "url"]) {
    if (!body[field]) return Response.json({ error: `${field} is required` }, { status: 400 });
  }
  const job = await prisma.job.upsert({
    where: { url: body.url },
    create: {
      title: body.title, company: body.company, url: body.url,
      location: body.location, description: body.description,
      externalId: body.externalId, matchScore: body.matchScore,
    },
    update: {
      title: body.title, company: body.company, location: body.location,
      description: body.description, externalId: body.externalId, matchScore: body.matchScore,
    },
  });
  return Response.json(job, { status: 201 });
}
