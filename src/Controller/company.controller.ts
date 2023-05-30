import { Request, Response } from "express";
import { uploadImage } from "../Utils/cloudinary.js";
import { PrismaClient } from "@prisma/client";
import { ICompanyFiles } from "../Middleware/file.middleware.js";
import { log } from "console";

const prisma = new PrismaClient();

const addCompany = async (req: Request, res: Response) => {
	try {
		const { user_id, name, bio } = req.body;
		const files = req.files as ICompanyFiles;

		if (!user_id) {
			return res.status(403).json({ message: "Token not found" });
		}

		if (!name || !bio) {
			return res.status(400).json({ message: "Please Enter all fields" });
		}

		let cover = undefined;
		if (files.coverPic && files.coverPic[0]) {
			cover = await uploadImage(
				files.coverPic[0],
				"onReserve/Companies/Cover"
			);
		}

		let profile = undefined;
		if (files.profilePic && files.profilePic[0]) {
			profile = await uploadImage(
				files.profilePic[0],
				"onReserve/Companies/Profile"
			);
		}

		const company = await prisma.company.create({
			data: {
				name,
				bio,
				rating: "",
				coverPic: cover?.secure_url,
				profPic: profile?.secure_url,
				owner: user_id,
			},
		});

		await prisma.companyUser.create({
			data: {
				companyId: company.id,
				userId: user_id,
			},
		});

		return res.status(200).json(company);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const editCompany = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { user_id, name, bio } = req.body;
	const files = req.files as ICompanyFiles;

	if (!id) {
		return res.status(400).json({ message: "Provide Company ID" });
	}

	if (!user_id) {
		return res.status(400).json({ message: "Token not found" });
	}

	const company = await prisma.company.findUnique({
		where: {
			id: parseInt(id),
		},
	});

	if (!company) {
		return res.status(404).json({ message: "Company not found" });
	}

	if (company.owner !== parseInt(user_id)) {
		return res.status(403).json({
			message: "You don't have an authority to edit this company",
		});
	}

	let cover = undefined;
	if (files.coverPic && files.coverPic[0]) {
		cover = await uploadImage(
			files.coverPic[0],
			"onReserve/Companies/Cover"
		);
	}

	let profile = undefined;
	if (files.profilePic && files.profilePic[0]) {
		profile = await uploadImage(
			files.profilePic[0],
			"onReserve/Companies/Profile"
		);
	}

	const updatedCompany = await prisma.company.update({
		where: {
			id: company.id,
		},
		data: {
			name,
			bio,
			coverPic: cover?.secure_url,
			profPic: profile?.secure_url,
		},
	});

	return res.status(200).json(updatedCompany);
};

const getCompany = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ message: "Company ID not found" });
	}

	const company = await prisma.company.findUnique({
		where: {
			id: parseInt(id),
		},
		include: {
			users: true,
			events: true,
		},
	});

	if (!company) {
		return res.status(404).json({ message: "Company not found" });
	}

	return res.status(200).json(company);
};

const getUserCompanies = async (req: Request, res: Response) => {
	const { user_id } = req.body;

	const companies = await prisma.companyUser.findMany({
		where: {
			userId: user_id,
		},
		select: {
			company: true,
		},
	});

	return res.json(companies);
};

const deleteCompany = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { user_id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "ID not found" });
	}

	const company = await prisma.company.findUnique({
		where: {
			id: parseInt(id),
		},
	});

	if (!company) {
		return res.status(404).json({ message: "Company not found" });
	}

	if (company?.owner != user_id) {
		return res
			.status(403)
			.json({ message: "You don't have permission to delete" });
	}

	const deletedCompany = await prisma.company.delete({
		where: {
			id: company.id,
		},
	});

	return res
		.status(200)
		.json({ message: "Deleted Successfully", data: deletedCompany });
};

export const companyController = {
	addCompany,
	editCompany,
	getCompany,
	getUserCompanies,
	deleteCompany,
};
