// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // Tailwind entry
/**
 * It is the Entry point for the React application.
 * Creates the root and  renders to  the App component.
 */

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
