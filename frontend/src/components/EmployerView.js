import React from "react";
import { context } from "../context";
import { Link } from "react-router-dom";
import axiosInstance from "../axios";

export default function EmployerView() {
  const { companyJobs, getJobsOfCompany, categories, getCategories } =
    React.useContext(context);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [categorySelected, setCategorySelected] = React.useState("1");

  React.useEffect(() => {
    getJobsOfCompany();
    getCategories();
  }, []);

  const jobDiv = (id, title, description) => (
    <div className="card border-dark mb-3" key={id}>
      <Link to={`/jobs/${id}`}>
        <div className="card-header">{title}</div>
      </Link>
      <div className="card-body text-dark">
        <p className="card-text">{description}</p>
      </div>
    </div>
  );

  const jobsDiv = companyJobs
    .filter((job) => job.status === "open")
    .map((job) => jobDiv(job.job_id, job.title, job.description));

  const optionsDiv = categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ));

  const postJob = () => {
    console.log(title, desc, categorySelected);
    axiosInstance
      .post("jobs/", {
        title,
        description: desc,
        category: categorySelected,
      })
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <div className="row d-flex justify-content-around">
      <div className="col container flex-column justify-content-center p-4 m-4">
        <h1>Your Jobs</h1>
        {jobsDiv}
      </div>
      <div className="col container d-flex justify-content-center p-4 m-2">
        <div className="container w-100">
          <div className="text-center">
            <h1>Post Job</h1>
          </div>

          <div className="col-lg-10 mx-auto">
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Description</label>
                <input
                  type="textarea"
                  className="form-control"
                  id="title"
                  placeholder="Enter description"
                  style={{
                    height: "200px",
                  }}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Category</label>
                <select
                  value={categorySelected}
                  onChange={(e) => setCategorySelected(e.target.value)}
                >
                  {optionsDiv}
                </select>
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    postJob(title, desc, categorySelected);
                  }}
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
