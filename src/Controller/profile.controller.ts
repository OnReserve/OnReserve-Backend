import { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient, Profile } from "@prisma/client";
import { uploadImage } from "../Utils/cloudinary.js";
import { IProfileFiles } from "../Types/profile.js";
import jwt from "jsonwebtoken";
import { secret } from "./Auth/login.controller.js";

const prisma = new PrismaClient();

dotenv.config();

async function getProfile(req: Request, res: Response) {
  try {
    const userID = Number(req.params.id);
    const { user_id } = req.body;

    if (userID !== user_id) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const profile: any = await prisma.profile.findUnique({
      where: {
        userId: userID,
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
    rest = { ...final, ...rest };

    return res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function editProfile(req: Request, res: Response) {
  try {
    const userID = Number(req.params.id);
    const files = req.files as IProfileFiles;

    const user_id = req.body?.user_id;
    const phoneNumber = req.body?.phoneNumber;
    const bio = req.body?.bio;
    const fname = req.body?.fname;
    const lname = req.body?.lname;

    if (userID !== user_id) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: userID,
      },
    });

    let pro = undefined;
    let cov = undefined;

    if (files.profilePic && files.profilePic[0]) {
      pro = await uploadImage(files.profilePic[0], "onReserve/Profile");
    }
    if (files.coverPic && files.coverPic[0]) {
      cov = await uploadImage(files.coverPic[0], "onReserve/Profile");
    }

    if (!profile) {
      if (!phoneNumber || !bio) {
        return res.status(400).json({ error: "Missing fields" });
      }
      const newProfile: any = await prisma.profile.create({
        data: {
          userId: userID,
          phoneNumber,
          bio,
          profilePic: pro?.url || "",
          coverPic: cov?.url || "",
        },
        include: {
          user: true,
        },
      });

      var { id, userId, createdAt, updatedAt, ProfileId, ...rest } = newProfile;
      const { password, emailVerifiedAt, rememberToken, ...final } = rest.user;
      delete rest.user;
      rest = { ...final, ...rest };

      return res.status(200).json(rest);
    }

    const updatedProfile: any = await prisma.profile.update({
      where: {
        userId: userID,
      },
      data: {
        phoneNumber,
        bio,
        profilePic: pro?.url,
        coverPic: cov?.url,
      },
      include: {
        user: true,
      },
    });

    var { id, userId, createdAt, updatedAt, ProfileId, ...rest } =
      updatedProfile;
    const { password, emailVerifiedAt, rememberToken, ...final } = rest.user;
    delete rest.user;

    const accessToken = jwt.sign({ userId: id }, secret);

    rest = { ...final, ...rest, token: accessToken };

    return res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Please Enter valid data" });
  }
}

const profileController = { getProfile, editProfile };

export default profileController;
