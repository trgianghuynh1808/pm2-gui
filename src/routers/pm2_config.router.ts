import express from "express";

// *INFO: internal modules
import PM2ConfigService from "../services/pm2_config.service";

const router = express.Router();

router.get("/", (_req, res) => {
  const content = PM2ConfigService.loadContent();

  res.json(content);
});

export default router;
