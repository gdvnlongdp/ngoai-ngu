import { Schema, Types, model } from "mongoose";
import { IChannel } from "./Channel";
import { IUser } from "./User";

export interface IAnswer {
  content: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id: string;
  content: string;
  answers: IAnswer[];
}

export interface ITest {
  id: Types.ObjectId;
  title: string;
  channel: IChannel;
  createdBy: IUser;
  publish: boolean;
  duration: number;
  questions: IQuestion[];
}

const schema = new Schema<ITest>(
  {
    title: {
      type: String,
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "channel",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    duration: {
      type: Number,
      default: 45, // 45 Minutes
    },
    publish: {
      type: Boolean,
      default: false,
    },
    questions: [
      {
        content: {
          type: String,
        },
        answers: [
          {
            content: {
              type: String,
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

schema.pre(
  /^(save|find|findOne|findOneAndUpdate|findOneAndDelete)$/,
  function (next) {
    this.populate(["channel", "createdBy"]);
    next();
  }
);

export const Test = model<ITest>("test", schema);
