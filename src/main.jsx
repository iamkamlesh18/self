import React from "react";
import { createRoot } from "react-dom/client";
import "./theme/tokens.css";
import "./theme/motion.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.body.firstElementChild).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
