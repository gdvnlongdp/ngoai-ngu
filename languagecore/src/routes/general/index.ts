import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { accountRouter } from "./accountRouter";
import { chatRouter } from "./chatRouter";
import { contactRouter } from "./contactRouter";
import { submitRouter } from "./submitRouter";

const router = Router();

router.use("/chat", verifyToken, chatRouter);
router.use("/account", verifyToken, accountRouter);
router.use("/contacts", verifyToken, contactRouter);
router.use("/submits", verifyToken, submitRouter);

export default router;
