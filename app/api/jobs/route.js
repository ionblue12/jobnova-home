

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