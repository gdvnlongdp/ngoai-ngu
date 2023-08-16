import { Router } from "express";
import {
  getChannelsOfSubmission,
  submit,
  getTests,
  registerTest,
  getSubmission,
} from "../../handlers/general/submitHandler";
import { verifyToken } from "../../middlewares/verifyToken";

const router = Router();

router.get("/channels", verifyToken, getChannelsOfSubmission);
router.get("/tests", verifyToken, getTests);

router.get("/submission/:testId", verifyToken, getSubmission);
router.post("/register/:test", verifyToken, registerTest);
router.post("/submit/:submissionId", verifyToken, submit);

export { router as submitRouter };
