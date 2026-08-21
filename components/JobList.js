import JobCard from "./JobCard";

export default function JobList({ jobs }) {
  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
        />
      ))}
    </div>
  );
}