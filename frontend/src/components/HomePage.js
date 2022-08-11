import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { context } from "../context";
import axiosInstance from "../axios";
import { abi, contractAddresses } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useMoralisWeb3Api } from "react-moralis";

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
  console.log(abi);
  console.log(contractAddresses);

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
      const [approvedProposal, setApprovedProposal] = useState(null);

      const { chainId: chainIdHex } = useMoralis();
      const contractAddress =
        parseInt(chainIdHex) in contractAddresses
          ? contractAddresses[parseInt(chainIdHex)][0]
          : null;

      const freelancerAddress =
        approvedProposal != null
          ? approvedProposal.freelancer.wallet_address
          : "";

      const priceContract =
        approvedProposal != null
          ? BigInt(Math.floor(approvedProposal.price) * 1000000000000000000)
          : "";

      const { runContractFunction: initiateContract } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "initContract",
        params: {
          _freelancer: freelancerAddress,
          _price: priceContract,
        },
      });

      const Web3Api = useMoralisWeb3Api();

      const sendContractInitTrnsaction = async () => {
        if (contractAddress == null) {
          return;
        }
        console.log("Sending transaction");
        console.log(freelancerAddress);
        console.log(priceContract);
        await initiateContract({
          onError: (err) => {
            console.log(err);
          },
          onSuccess: (tx) => {
            tx.wait().then(async (finalTx) => {
              console.log(finalTx);
              console.log(parseInt(finalTx.events[0].args[0]));
              await axiosInstance
                .post("contracts/", {
                  //server will update the status of job and proposal to "contract_running"
                  job: job.job_id,
                  freelancer: job.freelancer,
                  company: job.author.id,
                  eth_contract_address: parseInt(finalTx.events[0].args[0]),
                  status: "awaiting_start",
                })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                  alert("Waiting for freelancer to approve proposal");
                });
            });
          },
        });
      };

      const getApprovedProposal = async () => {
        axiosInstance
          .get(`jobs/proposal/${job.job_id}`)
          .then(async (res) => {
            setApprovedProposal(res.data);
            console.log("Approved Proposal", res);
            await sendContractInitTrnsaction();
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const postContract = async () => {
        console.log("Posting...");
        if (localStorage.getItem("connected")) {
          await getApprovedProposal();
        } else {
          alert("Please connect first!");
        }
      };
      const makeJobOpen = async () => {
        await axiosInstance
          .patch("jobs/" + job.job_id + "/", {
            status: "open",
            freelancer: null,
            title: job.title,
            description: job.description,
          })
          .then((res) => {
            console.log("Job status updated");
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      return (
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">{job.title}</h5>
            <p className="card-text">{job.description}</p>
            <Link to={`jobs/${job.job_id}`} className="btn btn-outline-primary">
              View Details
            </Link>
            <button
              onClick={postContract}
              className="btn btn-outline-primary ms-2"
            >
              Initiate Contract
            </button>
            <button
              onClick={makeJobOpen}
              className="btn btn-outline-primary ms-2"
            >
              Delete Proposal
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

      const deleteProposal = async () => {
        await axiosInstance
          .delete("proposals/" + proposal.proposal_id + "/")
          .then((res) => {
            console.log("Proposal deleted");
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        await axiosInstance
          .patch("jobs/" + proposal.job.job_id + "/", {
            status: "open",
            freelancer: null,
            title: proposal.job.title,
            description: proposal.job.description,
          })
          .then((res) => {
            console.log("Job status updated");
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
            <div className="flex gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={approveProposal}
              >
                Approve
              </button>
              <button
                className="btn btn-outline-primary ms-2"
                onClick={deleteProposal}
              >
                Delete
              </button>
            </div>
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
      const contractID =
        contract.eth_contract_address != null
          ? contract.eth_contract_address
          : "";

      const { chainId: chainIdHex } = useMoralis();
      const contractAddress =
        parseInt(chainIdHex) in contractAddresses
          ? contractAddresses[parseInt(chainIdHex)][0]
          : null;

      const { runContractFunction: confirmStartFunc } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "confirmStart",
        params: {
          _contractID: contractID,
        },
      });

      const { runContractFunction: depositFundsContract } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "deposit",
        params: {
          _contractID: contractID,
        },
        msgValue: BigInt(
          Math.floor(contract.proposal.price) * 1000000000000000000
        ),
      });

      const { runContractFunction: confirmDelivery } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "confirmDelivery",
        params: {
          _contractID: contractID,
        },
      });

      const markAsComplete = async () => {
        await confirmDelivery({
          onSuccess: (tx) => {
            tx.wait()
              .then(async (res) => {
                console.log(res);
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
              })
              .catch((err) => {
                console.log(err);
              });
          },
          onError: (err) => {
            console.log(err);
          },
        });
      };

      const depositFunds = async () => {
        await depositFundsContract({
          onSuccess: (tx) => {
            tx.wait()
              .then(async (res) => {
                console.log("Deposit successful");
                console.log(res);
                await axiosInstance
                  .patch("contracts/" + contract.contract_id + "/", {
                    status: "deposited",
                    eth_deposited: true,
                  })
                  .then((res) => {
                    console.log("Contract status updated");
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          },
          onError: (err) => {
            console.log(err);
          },
        });
      };

      const startContract = async () => {
        console.log(contract.eth_contract_address);
        await confirmStartFunc({
          onError: (err) => {
            console.log(err);
          },
          onSuccess: (res) => {
            console.log(res);
            const args = user.is_freelancer
              ? { freelancer_started: true }
              : { company_started: true };
            axiosInstance
              .patch("contracts/" + contract.contract_id + "/", args)
              .then((res) => {
                // console.log("Contract started");
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          },
        });
      };

      return (
        <div className="card text-center mt-2">
          <div className="card-body">
            <h5 className="card-title">{contract.job.title}</h5>
            <p className="card-text">{contract.freelancer.name}</p>
            <p className="card-text">{contract.proposal.price}</p>
            <p className="card-text">{contract.status}</p>
            {contract.status === "deposited" ? (
              <button
                className="btn btn-outline-primary"
                onClick={markAsComplete}
              >
                Mark as Complete
              </button>
            ) : (
              <></>
            )}
            {contract.status === "in_progress" &&
            user.is_freelancer === false ? (
              <button
                className="btn btn-outline-primary"
                onClick={depositFunds}
              >
                Deposit Funds
              </button>
            ) : (
              <></>
            )}
            {contract.status === "awaiting_start" ? (
              <button
                className="btn btn-outline-primary"
                onClick={startContract}
              >
                Start Contract
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
