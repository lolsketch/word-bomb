import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// get name from session storage
export const username =
  sessionStorage.getItem("name") ||
  prompt("Enter a nickname") ||
  "guest" + Math.floor(Math.random() * 1000);

sessionStorage.setItem("name", username);
