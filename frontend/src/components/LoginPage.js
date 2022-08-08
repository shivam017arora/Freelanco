import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { context } from "../context";

export default function LoginPage({ register }) {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password1, setPassword1] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [checkedValue, setCheckedValue] = React.useState(false);
  const state = useContext(context);

  const loginForm = () => (
    <form>
      <h1 className="text-center blockquote">Login</h1>
      {/* <!-- Email input --> */}
      <div className="form-outline mb-4">
        <input
          type="email"
          id="form2Example1"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="form-label" for="form2Example1">
          Email address
        </label>
      </div>

      {/* <!-- Password input --> */}
      <div className="form-outline mb-4">
        <input
          type="password"
          id="form2Example2"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="form-label" for="form2Example2">
          Password
        </label>
      </div>

      {/* <!-- 2 column grid layout for inline styling --> */}
      <div className="row mb-4">
        <div className="col d-flex justify-content-center">
          {/* <!-- Checkbox --> */}
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="form2Example31"
              checked={checkedValue}
              onClick={() => {
                setCheckedValue(!checkedValue);
              }}
            />
            <label className="form-check-label" for="form2Example31">
              {" "}
              Remember me{" "}
            </label>
          </div>
        </div>

        <div className="col">
          {/* <!-- Simple link --> */}
          <a href="#!">Forgot password?</a>
        </div>
      </div>

      {/* <!-- Submit button --> */}
      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary btn-block mb-4"
          onClick={async () => {
            await state.login(username, password);
            navigate("/");
          }}
        >
          Sign in
        </button>
      </div>

      {/* <!-- Register buttons --> */}
      <div className="text-center">
        <p>Not a member?</p>
        <p>
          <Link to="/register" className="btn btn-outline-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );

  const signupForm = () => (
    <form>
      <h1 className="text-center blockquote">Register</h1>
      {/* <!-- Email input --> */}
      <div className="form-outline mb-4">
        <input
          type="email"
          id="form2Example1"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="form-label" for="form2Example1">
          Email address
        </label>
      </div>

      {/* <!-- Password input --> */}
      <div className="form-outline mb-4">
        <input
          type="password"
          id="form2Example2"
          className="form-control"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
        <label className="form-label" for="form2Example2">
          Password 1
        </label>
      </div>

      {/* <!-- Password input --> */}
      <div className="form-outline mb-4">
        <input
          type="password"
          id="form2Example2"
          className="form-control"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <label className="form-label" for="form2Example2">
          Password 2
        </label>
      </div>

      {/* <!-- 2 column grid layout for inline styling --> */}
      <div className="row mb-4">
        <div className="col d-flex justify-content-center">
          {/* <!-- Checkbox --> */}
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="form2Example31"
              checked={checkedValue}
              onClick={() => {
                setCheckedValue(!checkedValue);
              }}
            />
            <label className="form-check-label" for="form2Example31">
              {" "}
              Are you a freelancer?{" "}
            </label>
          </div>
        </div>
      </div>

      {/* <!-- Submit button --> */}
      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary btn-block mb-4"
          onClick={async () => {
            await state.signup(username, password1, checkedValue);
            navigate("/login");
          }}
        >
          Sign Up
        </button>
      </div>
    </form>
  );

  return (
    <div className="login_container">
      <div className="d-flex justify-content-around">
        <div className="container m-2 p-2 w-25 shadow-lg p-3 mb-5 bg-light rounded form_container">
          {register ? signupForm() : loginForm()}
        </div>
      </div>
    </div>
  );
}
