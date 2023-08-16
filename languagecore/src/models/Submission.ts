import { Schema, Types, model } from "mongoose";
import { ITest } from "./Test";
import { IUser } from "./User";

export interface IAnswer {
  answer: boolean[];
}

export interface ISubmission {
  id: Types.ObjectId;
  test: ITest;
  user: IUser;
  startedAt: Date;
  submitedAt: Date;
  answers: IAnswer[];
}

const schema = new Schema<ISubmission>({
  test: {
    type: Schema.Types.ObjectId,
    ref: "test",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  submitedAt: {
    type: Date,
  },
  answers: [
    {
      answers: [
        {
          type: Boolean,
          default: false,
        },
      ],
    },
  ],
});

schema.pre(
  /^(save|find|findOne|findOneAndUpdate|findOneAndDelete)$/,
  function (next) {
    this.populate(["test", "user"]);
    next();
  }
);

export const Submission = model<ISubmission>("submission", schema);
