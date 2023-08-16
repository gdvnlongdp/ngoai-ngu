import { Request, Response } from "express";
import { Test } from "../../models/Test";

export const getTests = async (req: Request, res: Response) => {
  try {
    const tests = await Test.find({});

    res.json({ tests });
  } catch (err) {
    res.status(400).json({
      message: "Get tests failed",
    });
    console.log(err);
  }
};

export const getTest = async (req: Request, res: Response) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      res.status(404).json({
        message: "Test isn't found",
      });
      return;
    }

    res.json({ test });
  } catch (err) {
    res.status(400).json({
      message: "Get test failed",
    });
    console.log(err);
  }
};

export const createTest = async (req: Request, res: Response) => {
  const { title, channel, duration, publish, questions } = req.body;
  const newTest = new Test({
    title,
    channel,
    createdBy: req.user.id,
    publish,
    duration,
    questions,
  });

  try {
    await newTest.save();
    res.json({ test: newTest });
  } catch (err) {
    res.status(400).json({
      message: "Create test failed",
    });
    console.log(err);
  }
};

export const updateTest = async (req: Request, res: Response) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body);
    res.json({ test });
  } catch (err) {
    res.status(400).json({
      message: "Update test failed",
    });
    console.log(err);
  }
};

export const deleteTest = async (req: Request, res: Response) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    res.json({ test });
  } catch (err) {
    res.status(400).json({
      message: "Update test failed",
    });
    console.log(err);
  }
};
