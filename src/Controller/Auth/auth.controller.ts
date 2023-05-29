import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { log } from "util";

dotenv.config();

const secret: string = process.env.JWT_SECRET!;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req.headers.authorization!.split(" ")[1];
    const decodedToken = jwt.verify(token, secret);

    if (typeof decodedToken === "object" && decodedToken.userId) {
      req.body.user_id = decodedToken.userId;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Authentication failed!" });
  }
};
