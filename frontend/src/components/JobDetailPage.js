import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import Header from "./Header";
import { context } from "../context";
import JobControl from "./JobControl";

export default function JobDetailPage() {
  const [details, setDetails] = React.useState({});
  const { id } = useParams();
  const { user } = React.useContext(context);
  const [price, setPrice] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [proposals, setProposals] = React.useState([]);

  const isFreelancer = user.is_freelancer;

  useEffect(() => {
    async function getData() {
      await axiosInstance
        .get("jobs/" + id + "/")
        .then((res) => {
          console.log(res.data);
          setDetails(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      await axiosInstance
        .get("proposals/?job=" + id)
        .then((res) => {
          setProposals(res.data);
          console.log("Proposals", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getData();
  }, []);

  const postProposal = async () => {
    axiosInstance
      .post("proposals/", {
        job: details,
        price,
        message,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const freelancerPostProposalForm = () => {
    return (
      <>
        <div className="text-center">
          <h1>Post Proposal</h1>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="title">Price</label>
            <input
              type="number"
              className="form-control"
              id="price"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Message</label>
            <input
              type="textarea"
              className="form-control"
              id="message"
              placeholder="Enter message"
              style={{
                height: "200px",
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={() => {
                console.log(price, message);
                postProposal(price, message);
              }}
            >
              Post Proposal
            </button>
          </div>
        </form>
      </>
    );
  };

  const employerProposalsListDiv = () => {
    const Card = ({ proposal }) => {
      const hireFreelancer = async () => {
        await axiosInstance
          .patch("proposals/" + proposal.proposal_id + "/", {
            status: "accepted",
          })
          .then((res) => {
            console.log("Proposal updated");
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        await axiosInstance
          .patch("jobs/" + id + "/", {
            freelancer: proposal.freelancer.id,
            status: "pending",
            title: details.title,
            description: details.description,
          })
          .then((res) => {
            console.log("Job updated");
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      return (
        <div
          className="col-lg-10 mx-auto mb-4"
          key={proposal.proposal_id}
          style={{
            minWidth: "300px",
          }}
        >
          <div
            className="card m-2 p-2 flex-column justify-content-center"
            style={{
              textAlign: "center",
            }}
          >
            <h3 className="text-muted">Proposal</h3>
            <p className="text-muted">Message: {proposal.message}</p>
            <p className="text-muted">Price: {proposal.price}</p>
            <p className="text-muted">Status: {proposal.status}</p>
            <h3 className="text-muted">Freelancer</h3>
            <p className="text-muted">
              Wallet: {proposal.freelancer.wallet_address}
            </p>
            <p className="text-muted">Name: {proposal.freelancer.name}</p>
            <p className="text-muted">Email: {proposal.freelancer.email}</p>
            {proposal.status === "sent" && (
              <>
                <button
                  className="btn btn-outline-success"
                  onClick={() => hireFreelancer()}
                >
                  Start Negotiating
                </button>
                <button className="btn btn-outline-danger mt-2">Reject</button>
              </>
            )}
            {proposal.status === "accepted" && (
              <>
                <button className="btn btn-outline-success" disabled>
                  Hired
                </button>
              </>
            )}
            {/*.stringify(approvedProposal)} */}
          </div>
        </div>
      );
    };
    const listDiv =
      proposals.length > 0 ? (
        proposals.map((proposal) => {
          return <Card key={proposal.proposal_id} proposal={proposal} />;
        })
      ) : (
        <></>
      );
    return (
      <>
        <div className="text-center">
          <h1>Proposals</h1>
        </div>
        {listDiv}
      </>
    );
  };

  const updateProposal = async (price) => {
    const proposal = proposals.find((proposal) => {
      return proposal.status === "accepted" && proposal.job.job_id == id;
    });
    console.log(proposal);
    await axiosInstance
      .patch("proposals/" + proposal.proposal_id + "/", {
        price,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const boxDetails = ({ details, company }) => {
    return (
      <div
        className="col-lg-8"
        style={{
          minWidth: "60vw",
        }}
      >
        {details && (
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">
                    {company == true ? "Company Name" : "Job Title"}
                  </p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">
                    {details != null
                      ? company == true
                        ? details.name
                        : details.title
                      : "Loading"}
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">
                    {" "}
                    {details != null
                      ? company == true
                        ? "Email"
                        : "Job Description"
                      : "Loading"}
                  </p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">
                    {details != null
                      ? company == true
                        ? details.email
                        : details.description
                      : "Loading"}
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">
                    {company == true ? "Rating" : "Freelancer"}
                  </p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">
                    {details != null
                      ? company == true
                        ? details.rating
                        : details.freelancer
                      : "Loading"}
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">
                    {company == true ? "Wallet" : "Status"}
                  </p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">
                    {details != null
                      ? company == true
                        ? details.wallet_address
                        : details.status
                      : "Loading"}
                  </p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">
                    {company == true ? "About Us" : "Created"}
                  </p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">
                    {details != null
                      ? company == true
                        ? details.description
                        : details.created_at
                      : "Loading"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  let approvedProposal = proposals.find((proposal) => {
    return proposal.status === "accepted" && proposal.job.job_id == id;
  });
  approvedProposal = approvedProposal ? approvedProposal : {};

  return (
    <>
      <Header />
      <div className="row d-flex justify-content-around">
        <div className="col container flex-column justify-content-center p-4 m-4">
          <h3 className="text-muted">Job Details</h3>
          {boxDetails({
            details: details != null ? details : null,
            company: false,
          })}
          <h3 className="text-muted">Posted By</h3>
          {boxDetails({
            details: details.author != null ? details.author : null,
            company: true,
          })}
        </div>
        <div className="col container d-flex flex-column p-4 m-2">
          <div className="container w-100">
            <div className="col-lg-10 mx-auto">
              {user.is_freelancer ? (
                details.status == "open" ? ( // if job is open
                  freelancerPostProposalForm()
                ) : (
                  <>
                    <h1> Job Control Options</h1>
                    <JobControl job={details} />
                  </>
                )
              ) : details.status != "pending" ? ( //if user is company and job is not pending
                employerProposalsListDiv()
              ) : (
                // if user is company and job is pending i.e hired
                <>
                  {proposals.find((proposal) => {
                    return (
                      proposal.status === "approved" &&
                      proposal.job.job_id == id
                    );
                  }) == null ? (
                    <div
                      style={{
                        minWidth: "20vw",
                        // margin: "20px",
                      }}
                    >
                      <h3
                        className="text-muted"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Offer to Freelancer
                      </h3>

                      <div className="input-group mb-3">
                        <span className="input-group-text">ETH</span>
                        <input
                          type="text"
                          class="form-control"
                          aria-label="Amount (to the nearest dollar)"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        <span className="input-group-text">.00</span>
                      </div>
                      <button
                        className="btn btn-secondary w-100"
                        onClick={() => {
                          updateProposal(price);
                        }}
                      >
                        Change Price on Proposal
                      </button>
                      <div
                        className="card m-2 p-2 flex-column justify-content-center"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <h2 className="text-muted">Accepted Proposal</h2>
                        <p className="text-muted">
                          Message: {approvedProposal.message}
                        </p>
                        <p className="text-muted">
                          Price: {approvedProposal.price}
                        </p>
                        <p className="text-muted">
                          Status: {approvedProposal.status}
                        </p>
                        {/*.stringify(approvedProposal)} */}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
