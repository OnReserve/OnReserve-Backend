import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
dotenv.config();
async function getProfile(req, res) {
    const userId = Number(req.params.id);
    const { user_id } = req.body;
    if (userId !== user_id) {
        return res.status(401).json({ error: "Unauthorized Access" });
    }
    const profile = await prisma.profile.findUnique({
        where: {
            userId: userId,
        },
        include: {
            user: true,
        },
    });
    if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
    }
    return res.status(200).json(profile);
}
async function editProfile(req, res) {
    const userId = Number(req.params.id);
    const { user_id, phoneNumber, bio } = req.body;
    if (userId !== user_id) {
        return res.status(401).json({ error: "Unauthorized Access" });
    }
    const profile = await prisma.profile.findUnique({
        where: {
            userId: userId,
        },
    });
    if (!profile) {
        const newProfile = await prisma.profile.create({
            data: {
                userId,
                phoneNumber,
                bio,
            },
        });
        return res.status(200).json(newProfile);
    }
    const updatedProfile = await prisma.profile.update({
        where: {
            userId: userId,
        },
        data: {
            phoneNumber,
            bio,
        },
    });
    return res.status(200).json(updatedProfile);
}
const profileController = { getProfile, editProfile };
export default profileController;
//# sourceMappingURL=profile.controller.js.map