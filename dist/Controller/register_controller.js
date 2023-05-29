import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
dotenv.config();
async function register(req, res) {
    const { fname, lname, email, password } = req.body;
    if (!fname || !lname || !email || !password) {
        return res.status(400).json({ message: "Incomplete Request" });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    try {
        const user = await prisma.user.create({
            data: {
                fname,
                lname,
                email,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return res.json({ message: "User created successfully" });
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
//# sourceMappingURL=register_controller.js.map