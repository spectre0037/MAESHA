import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css"; // Ensure Tailwind is imported here

// Efficiency: Safely select the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element. Check your index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Provider connects your Redux Store to the entire React tree */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);