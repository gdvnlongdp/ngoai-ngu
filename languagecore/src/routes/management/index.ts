import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { userRouter } from "./userRouter";
import { profileRouter } from "./profileRouter";
import { roleRouter } from "./roleRouter";
import { permissionRouter } from "./permissionRouter";
import { channelRouter } from "./channelRouter";
import { groupRouter } from "./groupRouter";
import { requirementRouter } from "./requirementRouter";
import { testRouter } from "./testRouter";

const router = Router();

router.use("/users", verifyToken, userRouter);
router.use("/profiles", verifyToken, profileRouter);
router.use("/roles", verifyToken, roleRouter);
router.use("/permissions", verifyToken, permissionRouter);
router.use("/channels", verifyToken, channelRouter);
router.use("/groups", verifyToken, groupRouter);
router.use("/requirements", verifyToken, requirementRouter);
router.use("/tests", verifyToken, testRouter);

export default router;
