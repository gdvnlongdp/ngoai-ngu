import { Router } from "express";
import { loginRouter } from "./loginRouter";
import { passwordRouter } from "./passwordRouter";

const router = Router();

router.use("/login", loginRouter);
router.use("/password", passwordRouter);

export default router;
