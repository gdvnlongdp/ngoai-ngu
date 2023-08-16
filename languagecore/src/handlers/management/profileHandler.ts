import { Request, Response } from "express";
import { Profile } from "../../models/Profile";

export const getProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.find({});
    res.json({ profiles });
  } catch (err) {
    res.status(400).json({
      message: "Get profiles failed",
    });
    console.log(err);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      res.status(404).json({
        message: "Profile isn't found",
      });
      return;
    }

    res.json({ profile });
  } catch (err) {
    res.status(400).json({
      message: "Get profile failed",
    });
    console.log(err);
  }
};

export const createProfile = async (req: Request, res: Response) => {
  const { name, gender, phone, avatar } = req.body;
  const newProfile = new Profile({
    name,
    gender,
    phone,
    avatar,
  });

  try {
    await newProfile.save();
    res.json({ profile: newProfile });
  } catch (err) {
    res.status(400).json({
      message: "Create profile failed",
    });
    console.log(err);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body);
    res.json({ profile });
  } catch (err) {
    res.status(400).json({
      message: "Update profile failed",
    });
    console.log(err);
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    res.json({ profile });
  } catch (err) {
    res.status(400).json({
      message: "Delete profile failed",
    });
    console.log(err);
  }
};
