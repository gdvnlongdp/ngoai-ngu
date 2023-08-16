import { Router } from "express";
import { loginJwt } from "../../handlers/auth/loginHandler";

const router = Router();

router.post("/", loginJwt);

export { router as loginRouter };
