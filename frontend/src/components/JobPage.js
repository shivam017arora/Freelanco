import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { context } from "../context";
import FreelancerView from "./FreelancerView";
import EmployerView from "./EmployerView";

const JobPage = () => {
  const {
    user,
    categories,
    getCategories,
    companies,
    getCompanies,
    jobs,
    getJobs,
  } = useContext(context);
  const isFreelancer = user.is_freelancer;

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.getItem("access_token") ? <> </> : navigate("/login");
    getCategories();
    getCompanies();
    getJobs();
  }, []);

  const freelancerView = (
    <div>
      <FreelancerView
        categories={categories}
        companies={companies}
        jobs={jobs}
      />
    </div>
  );

  const employerView = (
    <div>
      <EmployerView />
    </div>
  );

  return (
    <div>
      <Header />
      {isFreelancer ? freelancerView : employerView}
    </div>
  );
};

export default JobPage;
