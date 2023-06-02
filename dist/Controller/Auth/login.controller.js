import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
dotenv.config();
const secret = process.env.JWT_SECRET;
async function login(req, res) {
    const email = req.body.email;
    const pass = req.body.password;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
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
    if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
    }
    var { id, userId, createdAt, updatedAt, ProfileId, ...rest } = profile;
    const { password, emailVerifiedAt, rememberToken, ...final } = rest.user;
    delete rest.user;
    rest = { ...final, ...rest, token: accessToken };
    return res.status(200).json(rest);
}
const loginController = { login };
export default loginController;
//# sourceMappingURL=login.controller.js.map