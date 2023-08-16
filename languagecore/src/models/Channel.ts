import { Schema, Types, model } from "mongoose";
import { IUser } from "./User";

export interface IChannel {
  id: Types.ObjectId;
  name: string;
  members: IUser[];
  description?: string;
}

const schema = new Schema<IChannel>({
  name: {
    type: String,
    trim: true,
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
    this.populate("members");
    next();
  }
);

export const Channel = model<IChannel>("channel", schema);
