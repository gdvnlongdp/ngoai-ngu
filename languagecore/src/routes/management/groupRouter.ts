import { Router } from "express";
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../../handlers/management/groupHandler";

const router = Router();

router.get("/", getGroups);
router.post("/", createGroup);

router.get("/:id", getGroup);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export { router as groupRouter };
