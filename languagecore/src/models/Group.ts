import { Schema, Types, model } from "mongoose";
import { IChannel } from "./Channel";
import { IUser } from "./User";

export interface IGroup {
  id: Types.ObjectId;
  name: string;
  channel: IChannel;
  members: IUser[];
  description?: string;
}

const schema = new Schema<IGroup>({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "channel",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  description: {
    type: String,
  },
});

schema.pre(
  /^(save|find|findOne|findOneAndUpdate|findOneAndDelete)$/,
  function (next) {
    this.populate(["channel", "members"]);
    next();
  }
);

export const Group = model<IGroup>("group", schema);
