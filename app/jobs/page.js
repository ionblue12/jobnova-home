"use client";

import { useEffect, useState } from "react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Request failed")))
      .then(setJobs)
      .catch((cause) => setError(cause.message));
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-semibold">Discovered jobs</h1>
      <p className="mt-2 text-sm text-gray-600">Review every job before creating an application.</p>
      {error && <p className="mt-6 text-red-700">{error}</p>}
      <div className="mt-6 space-y-3">
        {jobs.map((job) => (
          <article className="rounded-xl border bg-white p-4" key={job.id}>
            <a className="font-medium underline" href={job.url} target="_blank" rel="noreferrer">{job.title}</a>
            <p className="text-sm text-gray-600">{job.company} · {job.location || "Location not listed"}</p>
            {job.matchScore !== null && <p className="mt-2 text-xs">Keyword match: {job.matchScore}%</p>}
          </article>
        ))}
        {!jobs.length && !error && <p className="text-gray-500">No jobs discovered.</p>}
      </div>
    </main>
  );
}
