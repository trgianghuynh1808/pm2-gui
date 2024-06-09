require("dotenv").config();
import express from "express";

import { PM2ConfigRouter, ProcessRouter } from "./routers";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.redirect("/index.html");
});

app.get("/process", (req, res) => {
  const query = req.query;
  res.redirect(`/process.html?pm_id=${query.pm_id}&pm_name=${query.pm_name}`);
});

app.use("/processes", ProcessRouter);
app.use("/pm2-config", PM2ConfigRouter);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`[Server] Running on : http://localhost:${PORT}`);
});
