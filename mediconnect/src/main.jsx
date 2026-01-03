import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // ✅ Make sure App.jsx exports a default App

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <App />
   </React.StrictMode>
 

);
