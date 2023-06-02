import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
dotenv.config();
async function register(req, res) {
    const { fname, lname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    try {
        const user = await prisma.user.create({
            data: {
                fname,
                lname,
                email,
                password: hashedPassword,
            },
        });
        await prisma.profile.create({
            data: {
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
        const profile = await prisma.profile.findUnique({
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
        rest = { ...final, ...rest };
        return res.status(200).json(rest);
    }
    catch (error) {
        console.log(error);
        if (error.code === "P2002") {
            return res.status(500).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Failed to create user" });
    }
}
const registerController = { register };
export default registerController;
//# sourceMappingURL=register.controller.js.map