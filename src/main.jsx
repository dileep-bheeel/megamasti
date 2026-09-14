import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProgressProvider } from "./context/ProgressContext";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ProgressProvider><App /></ProgressProvider>
    </ErrorBoundary>
  </StrictMode>
);
