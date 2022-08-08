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
        <div className="col-lg-10 mx-auto mb-4" key={proposal.proposal_id}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Price: {proposal.price}</h5>
              <p className="card-text">Message: {proposal.message}</p>
              {/* <p className="card-text">Posted By: {proposal.freelancer}</p> */}
              {proposal.status === "sent" && (
                <>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => hireFreelancer()}
                  >
                    Start Negotiating
                  </button>
                  <button className="btn btn-outline-danger ms-2">
                    Reject
                  </button>
                </>
              )}
              {proposal.status === "accepted" && (
                <>
                  <button className="btn btn-outline-success" disabled>
                    Hired
                  </button>
                </>
              )}
            </div>
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

  return (
    <>
      <Header />
      <div className="row d-flex justify-content-around">
        <div className="col container flex-column justify-content-center p-4 m-4">
          <h1>Job Detail Page2 </h1>
          <h1> Details </h1>
          {JSON.stringify(details)}
          <h1> Proposals </h1>
          {JSON.stringify(proposals)}
        </div>
        <div className="col container d-flex flex-column justify-content-center p-4 m-2">
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
                  <h1>Freelancer Hired!</h1>
                  {proposals.find((proposal) => {
                    return (
                      proposal.status === "approved" &&
                      proposal.job.job_id == id
                    );
                  }) == null ? (
                    <>
                      <label htmlFor="price">Price:</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <button
                        className="btn btn-secondary w-100"
                        onClick={() => {
                          updateProposal(price);
                        }}
                      >
                        Change Price on Proposal
                      </button>
                    </>
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
