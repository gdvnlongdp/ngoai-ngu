import { Request, Response } from "express";
import { Group } from "../../models/Group";

export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.find({});
    res.json({ groups });
  } catch (err) {
    res.status(400).json({
      message: "Get groups failed",
    });
    console.log(err);
  }
};

export const getGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      res.status(404).json({
        message: "Group isn't found",
      });
      return;
    }

    res.json({ group });
  } catch (err) {
    res.status(400).json({
      message: "Get group failed",
    });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  const {
    name,
    channelId, // Ref "Channel"
    memberIds, // Ref "User"
    description,
  } = req.body;

  const newGroup = new Group({
    name,
    channel: channelId,
    members: memberIds,
    description,
  });

  try {
    await newGroup.save();
    res.json({ group: newGroup });
  } catch (err) {
    res.status(400).json({
      message: "Create group failed",
    });
    console.log(err);
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  req.body.members = req.body.memberIds;

  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body);
    res.json({ group });
  } catch (err) {
    res.status(400).json({
      message: "Update group failed",
    });
    console.log(err);
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    res.json({ group });
  } catch (err) {
    res.status(400).json({
      message: "Update group failed",
    });
    console.log(err);
  }
};
