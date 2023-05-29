import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;
export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        if (typeof decodedToken === "object" && decodedToken.userId) {
            req.body.user_id = decodedToken.userId;
            next();
        }
    }
    catch (error) {
        res.status(401).json({ message: "Authentication failed!" });
    }
};
//# sourceMappingURL=auth.controller.js.map