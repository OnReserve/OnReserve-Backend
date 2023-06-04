import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

dotenv.config();

const secret: string = process.env.JWT_SECRET!;

async function logout(req: Request, res: Response) {
	const { email } = req.body;

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		return res.status(401).json({ message: "User Not Found" });
	}

	return res.json({ message: "Successfully Logout" });
}

const logoutController = { logout };

export default logoutController;
