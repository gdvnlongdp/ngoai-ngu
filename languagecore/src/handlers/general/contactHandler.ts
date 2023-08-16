import { Request, Response } from "express";
import { Channel } from "../../models/Channel";
import { Conversation } from "../../models/Conversation";

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Channel.find({ members: req.user.id });
    const conversations = await Conversation.find({
      type: "ONE_TO_ONE",
      participants: req.user.id,
    });

    let _contacts = [...contacts];
    const contactHandled = _contacts.map((contact) => {
      const conversationsByChannel = conversations.filter(
        (item) => item.channel?.id === contact.id
      );

      const members = contact.toJSON().members.map((user) => {
        const conversation = conversationsByChannel.find((conversation) =>
          conversation.participants.find((el) => el.id === user.id)
        );

        return {
          ...user,
          id: conversation.id,
        };
      });

      return {
        ...contact.toJSON(),
        members,
      };
    });

    res.json({ contacts: contactHandled });
  } catch (err) {
    res.status(403).json({
      message: "Get contacts failed",
    });
    console.log(err);
  }
};
