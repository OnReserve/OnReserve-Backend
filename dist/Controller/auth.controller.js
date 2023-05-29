import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const secret = process.env.JWT_SECRET;
export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        if (typeof decodedToken === "object" && decodedToken.userid) {
            req.body.userid = { adminId: decodedToken.userid };
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Authentication failed!" });
    }
};
//# sourceMappingURL=auth.controller.js.map