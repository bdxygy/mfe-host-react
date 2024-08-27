import React from "react";
import fs from "fs/promises";
import path from "path";
import { cwd } from "process";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import {
  DataContextProvider,
  ServerContextDataT,
} from "../src/shared/data-context";
import express, { Express } from "express";
import compression from "compression";
import App from "../src/App";
import { encrypt } from "../src/shared/crypto";

// Resolve the path to the HTML template file
const htmlFilePath = path.resolve(cwd(), "dist", "index.html");
const app: Express = express();

// Serve static files from the "dist" directory
app.use(express.static(path.resolve(cwd(), "dist"), { index: false }));

app.use(
  compression({
    level: 9,
  })
);

app.get("*", async (req, res) => {
  try {
    const htmlTemplate = (
      await fs.readFile(htmlFilePath, { encoding: "utf-8" })
    ).split("<!-- SSR ENABLED -->");

    // Extract the content before and after <div id="root"></div>
    const beforeRootDiv = htmlTemplate[0];
    const afterRootDiv = htmlTemplate[1];

    res.setHeader("Content-Type", "text/html");

    const contextObject: ServerContextDataT = {
      _isServerSide: true,
      _requests: [],
      _data: {},
    };

    renderToString(
      <DataContextProvider value={contextObject}>
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      </DataContextProvider>
    );

    console.log("Context Request", contextObject._requests);
    if (contextObject._requests?.length) {
      await Promise.all(contextObject._requests);
      delete contextObject._requests;
    }

    contextObject._isServerSide = false;

    const { pipe } = renderToPipeableStream(
      <DataContextProvider value={contextObject}>
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      </DataContextProvider>,
      {
        onShellReady() {
          // Write the part before <div id="root"></div>
          res.write(beforeRootDiv);
          pipe(res); // Stream the React content
          res.write(
            afterRootDiv.replace(
              "</div>",
              `</div>
              <script type="application/text" id="__SIGNATURES__">${new Date().toLocaleDateString()}</script>
              <script type="application/json" id="__SERVER_DATA__">
              ${JSON.stringify({ _data: contextObject._data })}
              </script>`
            )
          ); // Close the root div and write the rest of the template
          res.end();
        },
        onAllReady() {},
        onError(err) {
          console.error("Error during rendering:", err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        },
      }
    );
  } catch (error) {
    console.error("Error reading HTML template:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

app.listen(8000, () => {
  console.log("App running at http://localhost:8000");
});
