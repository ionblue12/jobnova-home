import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const profileId = new URL(request.url).searchParams.get("profileId");
    const applications = await prisma.application.findMany({
      where: profileId ? { profileId } : undefined,
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(applications);
  } catch (error) {
    console.error("GET /api/applications error:", error);

    return Response.json(
      {
        error: "Failed to load applications",
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { jobId, profileId } = body;

    if (!jobId || !profileId) {
      return Response.json(
        { error: "jobId and profileId are required" },
        { status: 400 }
      );
    }

    const existingApplication =
      await prisma.application.findFirst({
        where: {
          jobId,
          profileId,
        },
      });

    if (existingApplication) {
      return Response.json(
        {
          error: "You already applied to this job",
          application: existingApplication,
        },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        profileId,
        status: "PENDING",
      },
    });

    return Response.json(application, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/applications error:", error);

    return Response.json(
      {
        error: "Failed to create application",
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
