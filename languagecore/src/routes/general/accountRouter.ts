import { Router } from "express";
import {
  accountInfo,
  changePassword,
  updateProfile,
} from "../../handlers/general/accountHandler";

const router = Router();

router.get("/", accountInfo);

router.put("/profile", updateProfile);

router.patch("/password", changePassword);

export { router as accountRouter };
