import { Router } from "express";
import { getCodes } from "../../handlers/management/requirementHandler";
import { verifyToken } from "../../middlewares/verifyToken";

const router = Router();

router.get("/reset-password/codes", verifyToken, getCodes);

export { router as requirementRouter };
