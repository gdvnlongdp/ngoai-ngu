import { Request, Response } from "express";
import { Group } from "../../models/Group";
import { Channel } from "../../models/Channel";

export const getChannels = async (req: Request, res: Response) => {
  try {
    const channels = await Channel.find({});
    const groups = await Group.find({});

    const _channels = channels.map((el) => {
      const groupsOfChannel = groups.filter(
        (group) => group.channel?.id === el.id
      ).length;
      
      return {
        ...el.toJSON(),
        groups: groupsOfChannel,
      };
    });
    res.json({ channels: _channels });
  } catch (err) {
    res.status(400).json({
      message: "Get channels failed",
    });
    console.log(err);
  }
};

export const getChannel = async (req: Request, res: Response) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      res.status(404).json({
        message: "Channel isn't found",
      });
      return;
    }

    res.json({ channel });
  } catch (err) {
    res.status(400).json({
      message: "Get channel failed",
    });
  }
};

export const createChannel = async (req: Request, res: Response) => {
  const {
    name,
    memberIds, // Ref "User"
    description,
  } = req.body;

  const newChannel = new Channel({
    name,
    members: memberIds,
    description,
  });

  try {
    await newChannel.save();
    res.json({ channel: newChannel });
  } catch (err) {
    res.status(400).json({
      message: "Create channel failed",
    });
    console.log(err);
  }
};

export const updateChannel = async (req: Request, res: Response) => {
  req.body.members = req.body.memberIds;

  try {
    const channel = await Channel.findByIdAndUpdate(req.params.id, req.body);
    res.json({ channel });
  } catch (err) {
    res.status(400).json({
      message: "Update channel failed",
    });
    console.log(err);
  }
};

export const deleteChannel = async (req: Request, res: Response) => {
  try {
    const channel = await Channel.findByIdAndDelete(req.params.id);
    res.json({ channel });
  } catch (err) {
    res.status(400).json({
      message: "Update channel failed",
    });
    console.log(err);
  }
};
