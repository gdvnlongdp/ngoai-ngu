import { Schema, Types, model } from "mongoose";

export interface IPermission {
  id: Types.ObjectId;
  name: string;
  description?: string;
}

const schema = new Schema<IPermission>({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
  },
});

export const Permission = model<IPermission>("permission", schema);
