import { Schema, Types, model } from "mongoose";
import { IUser } from "./User";

export interface ICode {
  id: Types.ObjectId;
  user: IUser;
  otp: string;
  createdAt?: Date;
}

const schema = new Schema<ICode>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "5m",
    default: Date.now,
  },
});

schema.pre(
  /^(save|find|findOne|findOneAndUpdate|findOneAndDelete)$/,
  function (next) {
    this.populate("user");
    next();
  }
);

export const Code = model<ICode>("code", schema);
