import React from "react";
import JobCard from "./JobCard";

export default function FreelancerView({ categories, companies, jobs }) {
  return (
    <div className="container mt-4 pt-4">
      {jobs.length > 0 ? (
        jobs.map((job) => {
          if (job.status != "open") {
            return <></>;
          }
          return (
            <JobCard
              key={job.job_id}
              title={job.title}
              desc={job.description}
              freelancer={job.freelancer}
              job_id={job.job_id}
              author={job.author}
            />
          );
        })
      ) : (
        <h1>No Jobs Found</h1>
      )}
    </div>
  );
}
