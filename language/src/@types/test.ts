import { Channel } from './channel';
import { User } from './user';

export type IAnswer = {
  content: string;
  isCorrect: boolean;
};

export type IQuestion = {
  content: string;
  answers: IAnswer[];
};

export type ITest = {
  id: string;
  title: string;
  channel: string;
  duration: number;
  publish: boolean;
  questions: IQuestion[];
};

export type Test = {
  id: string;
  title: string;
  channel: Channel;
  createdBy: User;
  duration: number;
  publish: boolean;
  updatedAt: string;
  questions: IQuestion[];
};

export type Submission = {
  answers: boolean[];
};

export type _Answer = {
  answers: boolean[];
};

export type ISubmission = {
  id: string;
  test: ITest;
  user: User;
  startedAt: Date;
  submitedAt: Date;
  answers: _Answer[];
};
