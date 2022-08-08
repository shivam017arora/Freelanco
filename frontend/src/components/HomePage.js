import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { context } from "../context";
import axiosInstance from "../axios";

const HomePage = () => {
  const {
    user,
    getJobs,
    jobs,
    freelancerOfUser,
    getFreelancerOfUser,
    companyOfUser,
    getCompaniesOfUser,
  } = useContext(context);
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);

  console.log(user);
  console.log(jobs);

  useEffect(() => {
    localStorage.getItem("access_token") ? <> </> : navigate("/login");
    const getData = async () => {
      await getJobs();
      await axiosInstance
        .get("contracts/")
        .then((res) => {
          console.log("Contracts", res);
          setContracts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      await axiosInstance
        .get("proposals/")
        .then((res) => {
          setProposals(res.data);
          console.log("Proposals", res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getData();
  }, [user]);

  const currentJobsDiv = ({ jobs }) => {
    const JobCard = ({ job }) => {
      const postContract = async () => {
        console.log("Posting...");
        await axiosInstance
          .post("contracts/", {
            //server will update the status of job and proposal to "contract_running"
            job: job.job_id,
            freelancer: job.freelancer,
            company: job.author.id,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            alert("Waiting for freelancer to approve proposal");
          });
      };
      return (
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">{job.title}</h5>
            <p className="card-text">{job.description}</p>
            <Link to={`jobs/${job.job_id}`} className="btn btn-secondary w-25">
              View Details
            </Link>
            <button
              onClick={postContract}
              className="btn btn-secondary w-25 ms-2"
            >
              Initiate Contract
            </button>
          </div>
          <div className="card-footer text-muted">{job.created_at}</div>
        </div>
      );
    };

    return (
      <>
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard job={job} key={job.id} />)
        ) : (
          <></>
        )}
      </>
    );
  };

  const pendingProposalsDiv = ({ proposals }) => {
    const ProposalCard = ({ proposal }) => {
      const approveProposal = async () => {
        await axiosInstance
          .patch("proposals/" + proposal.proposal_id + "/", {
            status: "approved",
          })
          .then((res) => {
            console.log("Proposal approved");
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      return (
        <div className="card text-center mt-2">
          <div className="card-body">
            <h5 className="card-title">{proposal.job.title}</h5>
            <p className="card-text">{proposal.price}</p>
          </div>
          <div className="card-footer text-muted">{proposal.created_at}</div>
          {proposal.status === "accepted" ? ( //accepted by customer
            <>
              <button
                className="btn btn-secondary w-25"
                onClick={approveProposal}
              >
                Approve
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      );
    };

    return (
      <>
        <h1>Your Proposals</h1>
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard proposal={proposal} key={proposal.id} />
          ))
        ) : (
          <></>
        )}
      </>
    );
  };

  const pendingContractsDiv = ({ contracts }) => {
    const ContractCard = ({ contract }) => {
      const markAsComplete = async () => {
        const args = user.is_freelancer
          ? { freelancer_completed: true }
          : { company_completed: true };
        await axiosInstance
          .patch("contracts/" + contract.contract_id + "/", args)
          .then((res) => {
            console.log("Contract marked as complete");
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      return (
        <div className="card text-center mt-2">
          <div className="card-body">
            <h5 className="card-title">{contract.job.title}</h5>
            <p className="card-text">{contract.freelancer.name}</p>
            <p className="card-text">{contract.proposal.price}</p>
            <p className="card-text">{contract.status}</p>
            {contract.status === "in_progress" ? (
              <button
                className="btn btn-secondary w-25"
                onClick={markAsComplete}
              >
                Mark as Complete
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className="card-footer text-muted">{contract.created_at}</div>
        </div>
      );
    };
    return (
      <>
        <h1>Your Contracts</h1>
        {contracts.length > 0 ? (
          contracts.map((contract) => (
            <ContractCard contract={contract} key={contract.id} />
          ))
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row d-flex justify-content-around">
          <div className="col container flex-column justify-content-center m-2">
            <>
              {user != null ? (
                pendingContractsDiv({
                  contracts: user.is_freelancer
                    ? contracts.filter(
                        (contract) =>
                          contract.freelancer.id == user.freelancer.id
                      )
                    : contracts.filter(
                        (contract) => contract.company.id == user.company.id
                      ),
                })
              ) : (
                <></>
              )}
            </>
          </div>
          <div className="col container flex-column justify-content-center m-2">
            {user != null ? (
              user.is_freelancer ? (
                pendingProposalsDiv({
                  proposals: proposals.filter(
                    (proposal) =>
                      proposal.freelancer.id === user.freelancer.id &&
                      (proposal.status === "sent" ||
                        proposal.status === "accepted" ||
                        proposal.status === "approved")
                  ),
                })
              ) : (
                <>
                  <h1>Jobs Hired</h1>
                  {currentJobsDiv({
                    jobs: jobs.filter(
                      (job) =>
                        job.status === "pending" &&
                        job.author.id === user.company.id
                    ),
                  })}
                </>
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
