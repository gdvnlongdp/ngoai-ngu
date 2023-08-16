import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import {
  createConversations,
  getChannelsOfChat,
  getConversation,
  getConversations,
  markConversationAsRead,
  removeMessageForEveryone,
  removeMessageForYou,
  searchConversations,
  sendMessage,
  unSendMessage,
} from "../../handlers/general/chatHandler";

const router = Router();

router.get("/search", verifyToken, searchConversations);

router.get("/channels", verifyToken, getChannelsOfChat);

router.get("/conversations", verifyToken, getConversations);

router.post("/conversations", verifyToken, createConversations);

router.get("/conversations/:id", verifyToken, getConversation);

router.delete("/conversations/:id", verifyToken);

router.post("/conversation/send-message", verifyToken, sendMessage);

router.get("/conversation/mark-as-seen", verifyToken, markConversationAsRead);

router.patch("/messages/unsend/:messageId", verifyToken, unSendMessage);

router.patch(
  "/messages/remove-for-you/:messageId",
  verifyToken,
  removeMessageForYou
);

router.patch(
  "/messages/remove-for-everyone/:messageId",
  verifyToken,
  removeMessageForEveryone
);

export { router as chatRouter };
