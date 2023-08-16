import { sign } from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../../models/User";
import { SECRET_KEY } from "../../config";

export const loginJwt = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(403).json({
        message: "User is not found",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(403).json({
        message: "Wrong password",
      });
      return;
    }

    const payload = {
      id: user.id,
      profile: {
        id: user.profile.id, // For update profile
      },
    };
    const token = sign(payload, SECRET_KEY, { expiresIn: 15 });

    res.json({
      accessToken: token,
      user,
    });
  } catch (err) {
    res.status(403).json({
      message: "Incorrect username or password",
    });
    console.log(err);
  }
};
