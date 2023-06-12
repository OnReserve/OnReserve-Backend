import { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient, Profile, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

dotenv.config();
const secret: string = process.env.JWT_SECRET!;

async function register(req: Request, res: Response) {
  const { fname, lname, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const user: User = await prisma.user.create({
      data: {
        fname,
        lname,
        email,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        userId: user.id,
        phoneNumber: "",
        profilePic: `https://api.dicebear.com/6.x/initials/svg?seed=${fname}%20${lname}`,
        bio: "",
      },
    });

    const accessToken = jwt.sign({ userId: user.id }, secret);

    const profile: any = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    var { id, userId, createdAt, updatedAt, ProfileId, ...rest } = profile;
    const { password, emailVerifiedAt, rememberToken, ...final } = rest.user;

    delete rest.user;
    rest = { ...final, ...rest, token: accessToken };

    return res.status(200).json(rest);
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Failed to create user" });
  }
}

const registerController = { register };

export default registerController;
