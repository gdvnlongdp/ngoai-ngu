import { Router } from "express";
import {
  createTest,
  deleteTest,
  getTest,
  getTests,
  updateTest,
} from "../../handlers/management/testHandler";

const router = Router();

router.get("/", getTests);
router.post("/", createTest);

router.get("/:id", getTest);
router.put("/:id", updateTest);
router.delete("/:id", deleteTest);

export { router as testRouter };
