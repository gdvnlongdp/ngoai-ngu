import { Request, Response } from "express";
import { Permission } from "../../models/Permission";

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await Permission.find({});
    res.json({ permissions });
  } catch (err) {
    res.status(400).json({
      message: "Get permissions failed",
    });
    console.log(err);
  }
};

export const getPermission = async (req: Request, res: Response) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      res.status(404).json({
        message: "Permission isn't found",
      });
      return;
    }

    res.json({ permission });
  } catch (err) {
    res.status(400).json({
      message: "Get permission failed",
    });
    console.log(err);
  }
};

export const createPermission = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const newPermission = new Permission({
    name,
    description,
  });

  try {
    await newPermission.save();
    res.json({ permission: newPermission });
  } catch (err) {
    res.status(400).json({
      message: "Create permission failed",
    });
    console.log(err);
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.json({ permission });
  } catch (err) {
    res.status(400).json({
      message: "Update permission failed",
    });
    console.log(err);
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    res.json({ permission });
  } catch (err) {
    res.status(400).json({
      message: "Delete permission failed",
    });
    console.log(err);
  }
};
