import { Request, Response } from "express";
import { Test } from "../../models/Test";
import { Channel } from "../../models/Channel";
import { Submission } from "../../models/Submission";

export const getChannelsOfSubmission = async (req: Request, res: Response) => {
  try {
    const channels = await Channel.find({ members: req.user.id });
    res.json({ channels });
  } catch (err) {
    res.status(400).json({
      message: "Get channel of submission failed",
    });
  }
};

export const getTests = async (req: Request, res: Response) => {
  try {
    const myChannels = await Channel.find({ members: req.user.id });
    const myChannelsMapped = myChannels.map((channel) => channel.id);

    const tests = await Test.find({ channel: { $in: myChannelsMapped } });
    res.json({ tests });
  } catch (err) {
    res.status(400).json({
      message: "Get tests failed",
    });
  }
};

export const registerTest = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findOne({
      test: req.params.test,
      user: req.user.id,
    });

    if (submission) {
      res.status(400).json({
        message: "Regsiter test failed",
      });
      return;
    }

    const newSubmission = new Submission({
      test: req.params.test,
      user: req.user.id,
    });
    await newSubmission.save();

    res.json({ submission: newSubmission });
  } catch (err) {
    res.status(400).json({
      message: "Register test failed",
    });
  }
};

export const getSubmission = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findOne({
      test: req.params.testId,
      user: req.user.id,
    });

    if (!submission) {
      res.status(400).json({
        message: "Submission not found",
      });
      return;
    }

    res.json({ submission });
  } catch (err) {
    res.status(400).json({
      message: "Get submission failed",
    });
  }
};

export const submit = async (req: Request, res: Response) => {
  try {
    let submission = await Submission.findById(req.params.submissionId);
    if (!submission || submission.submitedAt) {
      res.status(400).json({
        message: "Submit failed",
      });
      return;
    }

    submission.answers = req.body;
    submission.submitedAt = new Date();
    await submission.save();

    res.json({
      submission: submission,
    });
  } catch (err) {
    res.status(400).json({
      message: "Submit failed",
    });
  }
};
