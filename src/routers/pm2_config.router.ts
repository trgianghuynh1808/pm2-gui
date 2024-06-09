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

export default router;
