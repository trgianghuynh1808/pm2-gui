require("dotenv").config();
import express from "express";

import { PM2Service } from "./services/";
import { EProcessAction } from "./enums";

const app = express();

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.redirect("/index.html");
});

app.get("/processes", async (_req, res) => {
  const list = await PM2Service.getProcesses();

  res.json(list);
});

app.post("/process/:appName/:action/:env", async (req, res) => {
  const appName = req.params.appName;
  // const env = req.params.env;
  const action = req.params.action as EProcessAction;

  try {
    await PM2Service.excProcessAction(action, appName);

    res.status(200);
    res.send({
      message: "Succeed!",
    });
  } catch (error) {
    const customError = error as Error;

    res.status(500);
    res.send({
      message: customError.message ?? "Failed!",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[Server] Listening on :${PORT}`);
});
