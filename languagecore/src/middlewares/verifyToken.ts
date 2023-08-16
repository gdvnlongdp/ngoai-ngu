import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../config";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const token = req.header("Authorization")?.split("Bearer ")[1];
    if (!token) {
      res.status(403).json({
        message: "No authorization header",
      });
      return;
    }

    const decoded = verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      message: "Token lỏ rồi",
    });
    console.log(err);
  }
};
