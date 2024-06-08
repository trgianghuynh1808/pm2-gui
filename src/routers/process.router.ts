import express from "express";

// *INFO: internal modules
import { PM2Service } from "../services";
import { EProcessAction } from "../enums";

const router = express.Router();

router.get("/", async (_req, res) => {
  const list = await PM2Service.getProcesses();

  res.json(list);
});

router.post("/:appName/:action/:env", async (req, res) => {
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

export default router;
