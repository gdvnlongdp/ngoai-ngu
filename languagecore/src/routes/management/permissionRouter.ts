import { Router } from "express";
import {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
} from "../../handlers/management/permissionHandler";

const router = Router();

router.get("/", getPermissions);
router.post("/", createPermission);

router.get("/:id", getPermission);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

export { router as permissionRouter };
