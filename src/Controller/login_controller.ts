import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const loginController = {login}

const secret = process.env.JWT_SECRET;

function login (req:  Request, res: Response) {
    console.log(secret);

    if (req.body.username && req.body.password) {
        const username = req.body.username;
        const password = req.body.password;
        const id = req.body.id;
        const token = jwt.sign(
            { username: username, adminId:  id},
            secret!
            );
        res.status(200).json({ message: "Authentication successful!", token: token });
    }
    else {
        res.status(401).json({ message: "Login Authentication failed!" });
    }
}

loginController.login = login;

export default loginController;