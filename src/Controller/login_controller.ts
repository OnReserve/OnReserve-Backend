import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { log } from "console";

const prisma = new PrismaClient();

dotenv.config();

const secret: string = process.env.JWT_SECRET!;

async function login(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Incomplete Credentials" });
	}

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return res.status(401).json({ message: "Invalid email or password" });
	}

	const accessToken = jwt.sign({ userId: user.id }, secret);

	return res.json({
		token: accessToken,
		user: {
			id: user.id,
			fname: user.fname,
			lname: user.lname,
			email: user.email,
		},
	});
}

const loginController = { login };

export default loginController;
