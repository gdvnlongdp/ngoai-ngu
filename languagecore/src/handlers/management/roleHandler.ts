import { Request, Response } from "express";
import { Role } from "../../models/Role";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find({});
    res.json({ roles });
  } catch (err) {
    res.status(400).json({
      message: "Get roles failed",
    });
    console.log(err);
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(404).json({
        message: "Role isn't found",
      });
      return;
    }

    res.json({ role });
  } catch (err) {
    res.status(400).json({
      message: "Get role failed",
    });
    console.log(err);
  }
};

export const createRole = async (req: Request, res: Response) => {
  const {
    name,
    permissionIds, // Ref "permission"
    description,
  } = req.body;
  const newRole = new Role({
    name,
    permissions: permissionIds,
    description,
  });

  try {
    await newRole.save();
    res.json({ role: newRole });
  } catch (err) {
    res.status(400).json({
      message: "Create role failed",
    });
    console.log(err);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  req.body.permissions = req.body.permissionIds;

  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body);
    res.json({ role });
  } catch (err) {
    res.status(400).json({
      message: "Update role failed",
    });
    console.log(err);
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    res.json({ role });
  } catch (err) {
    res.status(400).json({
      message: "Update role failed",
    });
    console.log(err);
  }
};
