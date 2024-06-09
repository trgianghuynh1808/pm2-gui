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

app.use("/processes", ProcessRouter);
app.use("/pm2-config", PM2ConfigRouter);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`[Server] Listening on :${PORT}`);
});
