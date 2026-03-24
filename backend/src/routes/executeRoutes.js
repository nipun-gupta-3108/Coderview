import express from "express";
import { executeCode } from "../controllers/executeController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, executeCode);

export default router;
