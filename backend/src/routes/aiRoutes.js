import express from "express";
import { explainProblem, getHint, reviewCode } from "../controllers/aiController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/hint", protectRoute, getHint);
router.post("/review", protectRoute, reviewCode);
router.post("/explain", protectRoute, explainProblem);

export default router;
