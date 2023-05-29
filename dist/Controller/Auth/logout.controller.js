import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
dotenv.config();
const secret = process.env.JWT_SECRET;
async function logout(req, res) {
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
//# sourceMappingURL=logout.controller.js.map