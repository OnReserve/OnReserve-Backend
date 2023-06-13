import { PrismaClient } from "@prisma/client";
import { log } from "console";
import type { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const AdminAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user_id } = req.body;
		if (!user_id) {
			return res.status(401).json({ message: "Auth Failure" });
		}

		const user = await prisma.user.findUnique({
			where: {
				id: user_id,
			},
		});

		if (!user) {
			return res.status(401).json({ message: "Auth Failure" });
		}

		if (user.role !== "SUPERADMIN") {
			return res.status(403).json({ message: "Access Denied" });
		}

		return next();
	} catch (e) {
		return res.status(500).json({ message: "Internal Error" });
	}
};
