import { Schema, Types, model } from "mongoose";
import { IPermission } from "./Permission";

export interface IRole {
  id: Types.ObjectId;
  name: string;
  permissions: IPermission[];
  description?: string;
}

const schema = new Schema<IRole>({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: "permission",
    },
  ],
  description: {
    type: String,
  },
});

schema.pre(
  /^(save|find|findOne|findOneAndUpdate|findOneAndDelete)$/,
  function (next) {
    this.populate("permissions");
    next();
  }
);

export const Role = model<IRole>("role", schema);
