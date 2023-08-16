import { Schema, Types, model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
import { log } from "../utils/logger";
import { IRole } from "./Role";
import { IProfile } from "./Profile";

export interface IUser {
  id: Types.ObjectId;
  username: string;
  password: string;
  isBanned?: boolean;
  role: IRole;
  profile: IProfile;

  comparePassword: comparePasswordFunction;
}

type comparePasswordFunction = (candidatePassword: string) => Promise<boolean>;

const schema = new Schema<IUser>({
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "role",
    required: true,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "profile",
    required: true,
  },
});

schema.pre(
  /^(save|find|findOne|findOneAndUpdate|findOneAndDelete)$/,
  function (next) {
    this.populate(["role", "profile"]);
    next();
  }
);

schema.pre("save", async function (next) {
  let user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const SALT_WORK_FACTOR = 10;
  try {
    const salt = await genSalt(SALT_WORK_FACTOR);
    const passwordHashed = await hash(user.password, salt);
    user.password = passwordHashed;
  } catch (err) {
    log.error("hash password middleware failed");
    console.log(err);
  }
});

schema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this;

  try {
    const isMatch = await compare(candidatePassword, user.password);
    return isMatch;
  } catch (err) {
    log.error("compare password failed");
    console.log(err);
  }
};

export const User = model<IUser>("user", schema);
