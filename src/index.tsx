import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { DataContextProvider } from "./shared/data-context";
import { decrypt } from "./shared/crypto";

hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <DataContextProvider
      value={
        decrypt(document.getElementById("__SERVER_DATA__")?.textContent!) || {
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
