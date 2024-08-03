import express from "express";

// *INFO: internal modules
import PM2ConfigService from "../services/pm2_config.service";

const router = express.Router();

router.get("/", (_req, res) => {
  const content = PM2ConfigService.loadContent();

  res.status(200).json(content);
});

router.put("/", async (req, res) => {
  const bodyData = req.body;

  const isDone = await PM2ConfigService.writeContent(bodyData.content);

  res.status(200).send({ status: isDone });
});

router.get("/process/:appName", (req, res) => {
  try {
    const appName = req.params.appName;
    const content = PM2ConfigService.loadProcessContent(appName);

    res.status(200).json(content);
  } catch (error) {
    const customError = error as Error;

    res.status(500);
    res.send({
      message: customError.message ?? "Failed!",
    });
  }
});

router.put("/process/:appName", async (req, res) => {
  const bodyData = req.body;
  const appName = req.params.appName;

  const isDone = await PM2ConfigService.writeProcessContent(
    appName,
    bodyData.content,
  );

  res.status(200).send({ status: isDone });
});

export default router;
