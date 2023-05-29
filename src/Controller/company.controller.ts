import { Request, Response } from "express";

const addCompany = (req: Request, res: Response) => {
	const body = req.body;
	console.log({ body });
};

export const companyController = { addCompany };
