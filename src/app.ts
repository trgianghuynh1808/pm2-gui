require("dotenv").config();
import express from "express";

import { PM2Service } from "./services/";

const app = express();

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.redirect("/index.html");
});

app.get("/processes", async (_req, res) => {
  const list = await PM2Service.getProcesses();

  res.json(list);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[Server] Listening on :${PORT}`);
});
