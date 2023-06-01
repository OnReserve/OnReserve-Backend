import crypto from "crypto";
export const generateRandomToken = () => crypto.randomBytes(10).toString("hex");
