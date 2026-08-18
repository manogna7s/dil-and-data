import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { API_BASE_URL } from "./services/api.js";
import "./styles/global.css";

fetch(`${API_BASE_URL}/health`, { cache: "no-store", credentials: "omit" }).catch(
  () => {}
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
