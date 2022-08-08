import React, { useEffect } from "react";
import Header from "./Header";
import { context } from "../context";

export default function ProfilePage() {
  const {
    user,
    getCompaniesOfUser,
    companyOfUser,
    freelancerOfUser,
    getFreelancerOfUser,
  } = React.useContext(context);
  const [isFreelancer, setIsFreelancer] = React.useState(false);

  useEffect(() => {
    const getData = async () => {
      if (user.is_freelancer) {
        setIsFreelancer(true);
        await getFreelancerOfUser(user.user_id);
      } else {
        await getCompaniesOfUser(user.user_id);
      }
    };
    getData();
    console.log(companyOfUser);
    console.log(freelancerOfUser);
  }, []);

  return (
    <div>
      <Header />
      <>
        <div className="container p-4 row m-4">
          <div className="col">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img
                  src={
                    isFreelancer == true
                      ? freelancerOfUser.image
                      : companyOfUser.image
                  }
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{
                    width: "150px",
                    height: "150px",
                  }}
                />
                <h3 className="my-3">{user.first_name}</h3>
                <p className="text-muted mb-1">{user.about}</p>
                <div className="d-flex justify-content-center mb-2 mt-4">
                  <button type="button" className="btn btn-primary">
                    Connect
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary ms-1"
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">
                      {isFreelancer == true ? "Name" : "Company Name"}
                    </p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">
                      {isFreelancer == true
                        ? freelancerOfUser.name
                        : companyOfUser.name}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">
                      {isFreelancer == true
                        ? freelancerOfUser.email
                        : companyOfUser.email}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Category</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">
                      {isFreelancer == true
                        ? freelancerOfUser.category
                        : companyOfUser.category}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Wallet</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">
                      {isFreelancer == true
                        ? freelancerOfUser.wallet_address
                        : companyOfUser.wallet_address}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Description</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">
                      {isFreelancer == true
                        ? freelancerOfUser.description
                        : companyOfUser.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
