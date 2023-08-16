import { Request, Response } from "express";
import { User } from "../../models/User";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json({ users });
  } catch (err) {
    res.status(400).json({
      message: "Get users failed",
    });
    console.log(err);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: "User isn't found",
      });
      return;
    }

    res.json({ user });
  } catch (err) {
    res.status(400).json({
      message: "Get user failed",
    });
    console.log(err);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const {
    username,
    password,
    isBanned,
    roleId, // Ref "Role"
    profileId, // Ref "Profile"
  } = req.body;

  const newUser = new User({
    username,
    password,
    isBanned,
    role: roleId,
    profile: profileId,
  });

  try {
    await newUser.save();
    res.json({ user: newUser });
  } catch (err) {
    res.status(400).json({
      message: "Create user failed",
    });
    console.log(err);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({ user });
  } catch (err) {
    res.status(400).json({
      message: "Update user failed",
    });
    console.log(err);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ user });
  } catch (err) {
    res.status(400).json({
      message: "Delete user failed",
    });
    console.log(err);
  }
};
