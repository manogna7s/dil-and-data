import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildRobotsTxt, buildSitemapXml } from "../services/seo.service.js";

const router = Router();

router.get(
  "/robots.txt",
  asyncHandler(async (_req, res) => {
    const text = await buildRobotsTxt();
    res.type("text/plain").send(text);
  })
);

router.get(
  "/sitemap.xml",
  asyncHandler(async (_req, res) => {
    const xml = await buildSitemapXml();
    res.type("application/xml").send(xml);
  })
);

export default router;
