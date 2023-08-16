import { Schema, Types, model } from "mongoose";
import { IChannel } from "./Channel";
import { IMessage } from "./Message";
import { IUser } from "./User";

export interface IConversation {
  id: Types.ObjectId;
  channel: IChannel;
  participants: IUser[];
  type: "ONE_TO_ONE" | "GROUP";
  unread: IUser[];
  messages: IMessage[];
}

const schema = new Schema<IConversation>(
  {
    channel: {
      type: Schema.Types.ObjectId,
      ref: "channel",
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    type: {
      type: String,
      trim: true,
      uppercase: true,
      enum: ["ONE_TO_ONE", "GROUP"],
      required: true,
    },
    unread: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "message",
      },
    ],
  },
  { timestamps: true }
);

schema.pre(
  /^(save|find|findOne|findOneAndUpdate|findOneAndDelete)$/,
  function (next) {
    this.populate(["channel", "participants", "messages"]);
    next();
  }
);

export const Conversation = model<IConversation>("conversation", schema);
