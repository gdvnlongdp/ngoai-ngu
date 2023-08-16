import { Router } from "express";
import {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../../handlers/management/profileHandler";

const router = Router();

router.get("/", getProfiles);
router.post("/", createProfile);

router.get("/:id", getProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export { router as profileRouter };
