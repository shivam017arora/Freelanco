import React, { useEffect } from "react";
import axiosInstance from "../axios";
import { Link } from "react-router-dom";
import { context } from "../context";

export default function JobCard({
  title,
  desc,
  rating,
  freelancer,
  job_id,
  author,
}) {
  const [companyInfo, setCompanyInfo] = React.useState(null);
  const { setJobDetailCompany } = React.useContext(context);

  useEffect(() => {
    async function fetchData() {
      await axiosInstance
        .get(`/author/${author.id}/`)
        .then((res) => {
          console.log(res.data);
          setCompanyInfo(res.data);
          setJobDetailCompany(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, []);

  const companyDiv =
    companyInfo != null ? (
      <>
        <div>{companyInfo.email}</div>
        <div>{companyInfo.name}</div>
      </>
    ) : (
      <>No Company</>
    );

  return (
    <>
      <div className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg mb-4">
        <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
          <Link to={`${job_id}`} className="btn btn-secondary w-25">
            <h2 className="display-6 lh-1 fw-bold">{title}</h2>
          </Link>
          <span className="pt-2 pb-2 lh-1 fw-italic mt-2 mb-2">{desc}</span>
          <ul className="d-flex list-unstyled mt-auto">
            <li className="me-auto">
              <img
                src="https://github.com/twbs.png"
                alt="Bootstrap"
                width="32"
                height="32"
                className="rounded-circle border border-white"
              />
            </li>
            <li className="d-flex align-items-center">
              <svg className="bi me-2" width="1em" height="1em"></svg>
              <small>Posted By</small>
            </li>
            <li className="d-flex align-items-center">
              <svg className="bi me-2" width="1em" height="1em"></svg>
              <small>{companyDiv}</small>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
