import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { DataContextProvider } from "./shared/data-context";

let dataContext: any = document.getElementById("__SERVER_DATA__")?.textContent!;

if (dataContext) {
  dataContext = JSON.parse(dataContext);
}

hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <DataContextProvider
      value={
        dataContext || {
          data: {},
        }
      }
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataContextProvider>
  </React.StrictMode>
);
