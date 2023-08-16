import { Request, Response } from "express";
import { User } from "../../models/User";
import { Profile } from "../../models/Profile";

export const accountInfo = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(403).json({
        message: "Invalid token",
      });
      return;
    }

    res.json({ user });
  } catch (err) {
    res.status(403).json({
      message: "Get information failed",
    });
    console.log(err);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(403).json({
        message: "Invalid token",
      });
      return;
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      res.status(403).json({
        message: "Wrong old password",
      });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({ user });
  } catch (err) {
    res.status(403).json({
      message: "Change password failed",
    });
    console.log(err);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile.id,
      {},
      { new: true }
    );

    res.json({ profile });
  } catch (err) {
    res.status(400).json({
      message: "Update profile failed",
    });
    console.log(err);
  }
};
