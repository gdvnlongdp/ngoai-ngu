import { Router } from "express";
import {
  generateCode,
  verifyfNewPassword,
} from "../../handlers/auth/passwordHandler";

const router = Router();

router.post("/generate", generateCode);
router.post("/verify", verifyfNewPassword);

export { router as passwordRouter };
