import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../handlers/management/userHandler";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export { router as userRouter };
