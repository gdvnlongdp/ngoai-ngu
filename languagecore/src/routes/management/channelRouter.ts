import { Router } from "express";
import {
  getChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
} from "../../handlers/management/channelHandler";

const router = Router();

router.get("/", getChannels);
router.post("/", createChannel);

router.get("/:id", getChannel);
router.put("/:id", updateChannel);
router.delete("/:id", deleteChannel);

export { router as channelRouter };
