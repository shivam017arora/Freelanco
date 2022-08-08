import React, { useContext, useState } from "react";
import { context } from "../context";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const state = useContext(context);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    navigate("/jobs");
    await state.searchJobs(searchValue);
  };

  // const jobLinkText = state.user.is_freelancer != null ? "Jobs" : "My Jobs";

  return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <Link to="/">
          <img
            className="navbar-brand"
            style={{
              width: "70px",
              height: "70px",
              filter: "brightness(0) invert(1)",
            }}
            src="http://127.0.0.1:8000/media/logo.png"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jobs">
                Jobs
              </Link>
            </li>
          </ul>
        </div>
        <div
          className="d-flex justify-content-around"
          style={{
            gap: "20px",
          }}
        >
          <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              input={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="submit">
              Search
            </button>
          </form>
          <Link
            to={state.user ? "/profile" : "/login"}
            className="text-white text-uppercase"
          >
            <span className="text-white text-uppercase btn">
              Hello, {state.user ? state.user.first_name : ""}
            </span>
          </Link>
          <span>
            <Link
              to="/login"
              onClick={() => {
                state.logout();
              }}
              className="text-white text-uppercase btn"
            >
              Logout
            </Link>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
