import { Request, Response } from "express";
import { User } from "../../models/User";
import { Code } from "../../models/Code";

const randomCode = () => {
  return Math.floor(Math.random() * 99999 + 100000).toString();
};

export const generateCode = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json({
        message: "Invalid username",
      });
      return;
    }

    await Code.findOneAndDelete({ user: user.id });

    const newCode = new Code({
      user: user.id,
      otp: randomCode(),
    });
    await newCode.save();

    res.json({ code: newCode });
  } catch (err) {
    res.status(403).json({
      message: "Generate code failed",
    });
    console.log(err);
  }
};

export const verifyfNewPassword = async (req: Request, res: Response) => {
  try {
    const { username, code, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        message: "User is not found",
      });
      return;
    }

    const otp = await Code.findOne({ user: user.id, code });
    if (!otp) {
      res.status(400).json({
        message: "Invalid code",
      });
      return;
    }

    user.password = await password;
    await user.save();

    await Code.findByIdAndDelete(otp.id);

    res.json({ user });
  } catch (err) {
    res.status(403).json({
      message: "Verify new password failed",
    });
    console.log(err);
  }
};
