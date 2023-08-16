import { Request, Response } from "express";
import { Code } from "../../models/Code";

export const getCodes = async (req: Request, res: Response) => {
  try {
    const codes = await Code.find({});
    res.json({ codes });
  } catch (err) {
    res.status(400).json({
      message: "Get codes failed",
    });
    console.log(err);
  }
};
