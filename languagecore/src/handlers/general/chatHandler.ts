import { Request, Response } from "express";

import { Message } from "../../models/Message";
import { Channel } from "../../models/Channel";
import { Group } from "../../models/Group";
import { Conversation } from "../../models/Conversation";

export const getChannelsOfChat = async (req: Request, res: Response) => {
  try {
    const channels = await Channel.find({ members: req.user.id });
    res.json({ channels });
  } catch (err) {
    res.status(400).json({
      message: "Get channel of chat failed",
    });
  }
};

export const searchConversations = async (req: any, res: Response) => {
  const { channelKey, query } = req.query;

  try {
    const conversations = await Conversation.find({
      channel: channelKey,
      participants: req.user.id,
    });

    const results = conversations.filter((conversation) => {
      const otherParticipants = conversation.participants.filter(
        (member) => member.id !== req.user.id
      );

      return (
        otherParticipants.filter(
          (user) =>
            user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            user.profile.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
        ).length > 0
      );
    });

    res.json({ results });
  } catch (err) {
    res.status(403).json({
      message: "Search conversations failed",
    });
    console.log(err);
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await Conversation.find({
      channel: req.query.channelKey,
      participants: req.user.id,
    }).sort({ updatedAt: -1 });
    res.json({ conversations });
  } catch (err) {
    res.status(400).json({
      message: "Get conversations failed",
    });
    console.log(err);
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      channel: req.query.channelKey,
      participants: req.user.id,
    });
    if (!conversation) {
      res.status(403).json({
        message: "Conversation not found",
      });
      return;
    }

    res.json({ conversation });
  } catch (err) {
    res.status(403).json({
      message: "Get conversations failed",
    });
    console.log(err);
  }
};

export const createConversations = async (req: Request, res: Response) => {
  try {
    const channel = await Channel.findById(req.query.channelKey);
    if (!channel) {
      res.status(400).json({
        message: "Invalid channel key",
      });
      return;
    }

    const conversations = await Conversation.find({ channel: channel.id });

    const members = channel.members;

    const o2oConversations = conversations.filter(
      (conversation) => conversation.type === "ONE_TO_ONE"
    );

    for (let i = 0; i < members.length; i++) {
      for (let j = 0; j < i; j++) {
        let hasParticipants = false;
        for (let conv of o2oConversations) {
          const participantIds = conv.participants.map((user) => user.id);

          hasParticipants =
            hasParticipants ||
            (participantIds.includes(members[i].id) &&
              participantIds.includes(members[j].id));
        }

        if (!hasParticipants) {
          const newMessage = new Message({
            body: `${members[i].profile.name}, ${members[j].profile.name}`,
            senderId: "",
          });

          const newConversation = new Conversation({
            channel: channel.id,
            participants: [members[i].id, members[j].id],
            type: "ONE_TO_ONE",
            unread: [members[i].id, members[j].id],
            messages: [newMessage],
          });

          await newMessage.save();
          await newConversation.save();
        }
      }
    }

    // -------------------------------

    const groups = await Group.find({ channel: channel.id });

    const groupConversations = conversations.filter(
      (conversation) => conversation.type === "GROUP"
    );

    for (let group of groups) {
      const memberIds = group.members.map((user) => user.id);

      let hasParticipants = false;
      for (let conv of groupConversations) {
        const participantIds = conv.participants.map((user) => user.id);

        hasParticipants =
          hasParticipants ||
          (!memberIds.filter((id) => !participantIds.includes(id)).length &&
            participantIds.length === memberIds.length);
      }

      if (!hasParticipants) {
        const newMessage = new Message({
          body: `${group.members
            .slice(0, 2)
            .map((user) => user.profile.name)
            .join(", ")}, ...`,
          senderId: "",
        });

        const newConversation = new Conversation({
          channel: channel.id,
          participants: memberIds,
          type: "GROUP",
          unread: memberIds,
          messages: [newMessage],
        });

        await newMessage.save();
        await newConversation.save();
      }
    }

    res.json({
      message: "Create conversations success",
    });
  } catch (err) {
    res.status(400).json({
      message: "Create conversations failed",
    });
    console.log(err);
  }
};

export const markConversationAsRead = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findById(req.query.conversationKey);
    if (!conversation) {
      res.status(404).json({
        message: "Conversation isn't found",
      });
      return;
    }

    conversation.unread = conversation.unread.filter(
      (id) => id.toString() !== req.user.id.toString()
    );

    await conversation.save();

    res.json({ conversation });
  } catch (err) {
    res.status(400).json({
      message: "Mark conversation as read failed",
    });
    console.log(err);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message: body, contentType, senderId } = req.body.message;

    const conversation = await Conversation.findById(req.query.conversationKey);

    const newMessage = new Message({
      body,
      contentType,
      attachments: contentType === "text" ? [] : [body],
      senderId,
    });

    conversation.messages.push(newMessage.id);
    conversation.unread = conversation.participants.filter(
      (user) => user.id !== req.user.id
    );

    await newMessage.save();
    await conversation.save();

    res.json({ newMessage });
  } catch (err) {
    res.status(400).json({
      message: "Send message failed",
    });
    console.log(err);
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);

    res.json({ conversation });
  } catch (err) {
    res.status(400).json({
      message: "Delete conversation failed",
    });
    console.log(err);
  }
};

export const unSendMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findOneAndUpdate(
      {
        _id: req.params.messageId,
        senderId: req.user.id,
      },
      { unsend: true },
      { new: true }
    );

    res.json({ message });
  } catch (err) {
    res.status(400).json({
      message: "Unsend message failed",
    });
    console.log(err);
  }
};

export const removeMessageForYou = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { $push: { removeFor: req.user.id } },
      { new: true }
    );

    res.json({ message });
  } catch (err) {
    res.status(400).json({
      message: "Remove message for you failed",
    });
    console.log(err);
  }
};

export const removeMessageForEveryone = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findOne({
      messages: req.params.messageId,
    });

    const participantIds = conversation.participants.map((el) =>
      el.id.toString()
    );

    const message = await Message.findOneAndUpdate(
      {
        _id: req.params.messageId,
        senderId: req.user.id,
      },
      {
        $push: {
          removeFor: { $each: participantIds },
        },
      },
      { new: true }
    );

    res.json({ message });
  } catch (err) {
    res.status(400).json({
      message: "Remove message for everyone failed",
    });
    console.log(err);
  }
};
