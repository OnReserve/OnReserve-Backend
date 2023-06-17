import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

dotenv.config();

export const secret: string = process.env.JWT_SECRET! || "$#@#$@D@S#S";

async function login(req: Request, res: Response) {
	try {
		const email = req.body.email;
		const pass = req.body.password;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res
				.status(401)
				.json({ message: "Invalid email or password" });
		}

		const isPasswordValid = await bcrypt.compare(pass, user.password);

		if (!isPasswordValid) {
			return res
				.status(401)
				.json({ message: "Invalid email or password" });
		}

		const accessToken = jwt.sign({ userId: user.id }, secret);

		const profile = await prisma.profile.findUnique({
			where: {
				userId: user.id,
			},
			include: {
				user: true,
			},
		});

		if (!profile || !profile.user) {
			return res.status(404).json({ error: "Profile not found" });
		}

		var {
			id,
			userId,
			createdAt,
			updatedAt,
			user: current,
			...rest
		} = profile;
		const { password, emailVerifiedAt, rememberToken, ...final } =
			profile.user;

		let response = { ...final, ...rest, token: accessToken };

		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}

const loginController = { login };

export default loginController;
