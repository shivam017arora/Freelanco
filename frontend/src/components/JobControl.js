import React from "react";

export default function JobControl({ job }) {
  return (
    <div
      style={{
        maxWidth: "300px",
      }}
    >
      {JSON.stringify(job)}
    </div>
  );
}
