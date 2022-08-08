import React from "react";
import { render } from "react-dom";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import { ContextProvider } from "../context";
import JobPage from "./JobPage";
import JobDetailPage from "./JobDetailPage";
import ProfilePage from "./ProfilePage";

const routes = (
  <BrowserRouter>
    <ContextProvider>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage register={false} />}></Route>
        <Route path="/register" element={<LoginPage register={true} />}></Route>
        <Route path="/jobs" element={<JobPage />}></Route>
        <Route path="/jobs/:id" element={<JobDetailPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
      </Routes>
    </ContextProvider>
  </BrowserRouter>
);

// const appDiv = document.getElementById("app");
// render(routes, appDiv);

const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(routes);
