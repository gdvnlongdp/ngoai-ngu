import { Schema, Types, model } from "mongoose";
import { IUser } from "./User";

export interface IMessage {
  id: Types.ObjectId;
  body: string;
  contentType: "text" | "image";
  attachments: string[];
  createdAt: Date;
  senderId?: IUser;
  unsend: boolean;
  removeFor: string[];
}

const schema = new Schema<IMessage>({
  body: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ["text", "image"],
    default: "text",
  },
  attachments: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  senderId: {
    type: String,
  },
  unsend: {
    type: Boolean,
    default: false,
  },
  removeFor: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

export const Message = model<IMessage>("message", schema);
