import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { getContacts } from "../../handlers/general/contactHandler";

const router = Router();

router.get("/", verifyToken, getContacts);

export { router as contactRouter };
