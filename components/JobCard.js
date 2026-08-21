"use client";

import { useState } from "react";
import {
  Link,
  Heart,
  MapPin,
  Building2,
  Radio,
} from "lucide-react";

import MatchCircle from "./MatchCircle";

export default function JobCard({ job }) {
  const [liked, setLiked] = useState(job.liked);

  return (
    <article className="rounded-2xl bg-white px-5 py-4 shadow-sm">
      <div className="flex gap-5">
        <MatchCircle value={job.match} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#111]">
                {job.title}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                <Building2 size={13} />
                <span>{job.company}</span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={13} />
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Radio size={12} />
                  <span>{job.workType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="text-gray-500 hover:text-black"
                aria-label="Copy job link"
              >
                <Link size={17} />
              </button>

              <button
                onClick={() => setLiked((prev) => !prev)}
                className="text-gray-500 hover:text-[#9d73f5]"
                aria-label="Like job"
              >
                <Heart
                  size={18}
                  fill={liked ? "#9d73f5" : "none"}
                  className={
                    liked
                      ? "text-[#9d73f5]"
                      : "text-gray-500"
                  }
                />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Tag>{job.employmentType}</Tag>
            <Tag>{job.experience}</Tag>
            <Tag>{job.level}</Tag>
            <Tag>{job.salary}</Tag>
          </div>

          <div className="mt-3 border-t pt-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="rounded-full bg-[#f1ecff] px-3 py-1 text-[#7152b8]">
                  {job.posted}
                </span>

                <span>
                  {job.applicants} applicants
                </span>
              </div>

              <div className="flex gap-3">
                <button className="rounded-full border px-5 py-2 text-sm">
                  Apply
                </button>

                <button className="rounded-full bg-[#a8ff19] px-5 py-2 text-sm text-black">
                  Mock Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border bg-white px-3 py-1 text-xs text-gray-600">
      {children}
    </span>
  );
}