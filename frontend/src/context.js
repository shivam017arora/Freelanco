import React, { useEffect } from "react";
import jwt_decode from "jwt-decode";
import axiosInstance from "./axios";

const context = React.createContext(null);
const { Provider } = context;

function ContextProvider({ children }) {
  const [user, setUser] = React.useState(() =>
    localStorage.getItem("access_token")
      ? jwt_decode(localStorage.getItem("access_token"))
      : null
  );
  const [categories, setCategories] = React.useState([]);
  const [companies, setCompanies] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const [companyOfUser, setCompanyOfUser] = React.useState({});
  const [freelancerOfUser, setFreelancerOfUser] = React.useState({});
  const [companyJobs, setCompanyJobs] = React.useState([]);
  const [jobDetailCompany, setJobDetailCompany] = React.useState({});

  const loginUser = async (email, password) => {
    await axiosInstance.post("token/", { email, password }).then((res) => {
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      console.log(res.data.access);
      setUser(jwt_decode(res.data.access));
    });
  };

  const signupUser = async (email, password, is_freelancer) => {
    await axiosInstance
      .post("accounts/register/", {
        email,
        password,
        is_freelancer,
        is_company: !is_freelancer,
      })
      .then((res) => {
        console.log(res);
        // localStorage.setItem('email', res.data.email);
      });
  };

  const logoutUser = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const getCategories = async () => {
    await axiosInstance
      .get("category/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCompanies = async () => {
    await axiosInstance
      .get("employer/")
      .then((res) => {
        setCompanies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getJobs = async () => {
    await axiosInstance
      .get("jobs/")
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getJobsOfCompany = async (id) => {
    await axiosInstance
      .get(`jobs/author/`)
      .then((res) => {
        setCompanyJobs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchJobs = async (search) => {
    console.log("jobs/?search=" + search);
    await axiosInstance.get("jobs/?search=" + search).then((res) => {
      setJobs(res.data);
    });
  };

  const getCompaniesOfUser = async (userId) => {
    axiosInstance
      .get("company/" + userId + "/")
      .then((res) => {
        setCompanyOfUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFreelancerOfUser = async (userId) => {
    axiosInstance
      .get("freelancer/" + userId + "/")
      .then((res) => {
        setFreelancerOfUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Provider
      value={{
        user: user,
        login: loginUser,
        logout: logoutUser,
        signup: signupUser,
        categories: categories,
        getCategories: getCategories,
        companies: companies,
        getCompanies: getCompanies,
        companyOfUser: companyOfUser,
        getCompaniesOfUser: getCompaniesOfUser,
        freelancerOfUser: freelancerOfUser,
        getFreelancerOfUser: getFreelancerOfUser,
        jobs: jobs,
        getJobs: getJobs,
        companyJobs: companyJobs,
        jobDetailCompany: jobDetailCompany,
        setJobDetailCompany: setJobDetailCompany,
        getJobsOfCompany: getJobsOfCompany,
        searchJobs: searchJobs,
      }}
    >
      {children}
    </Provider>
  );
}

export { context, ContextProvider };
