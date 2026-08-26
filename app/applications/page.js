"use client";

import { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/applications")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Request failed")))
      .then(setApplications)
      .catch((cause) => setError(cause.message));
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-semibold">Applications</h1>
      <p className="mt-2 text-sm text-gray-600">Durable status from the Indeed worker.</p>
      {error && <p className="mt-6 text-red-700">{error}</p>}
      <div className="mt-6 space-y-3">
        {applications.map((application) => (
          <article className="rounded-xl border bg-white p-4" key={application.id}>
            <div className="flex items-center justify-between gap-4">
              <div><h2 className="font-medium">{application.job.title}</h2>
                <p className="text-sm text-gray-600">{application.job.company}</p></div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">{application.status}</span>
            </div>
            {(application.manualAction || application.error) &&
              <p className="mt-3 text-sm text-amber-800">{application.manualAction || application.error}</p>}
          </article>
        ))}
        {!applications.length && !error && <p className="text-gray-500">No applications queued.</p>}
      </div>
    </main>
  );
}
