import { Schema, Types, model } from "mongoose";

export interface IProfile {
  id: Types.ObjectId;
  name: string;
  gender: "male" | "female";
  phone: string;
  avatar?: string;
}

const schema = new Schema<IProfile>({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  gender: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ["male", "female"],
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  avatar: {
    type: String,
  },
});

export const Profile = model<IProfile>("profile", schema);
