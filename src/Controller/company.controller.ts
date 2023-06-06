import { Request, Response } from "express";
import { ICompanyFiles } from "../Types/company.js";
import { uploadImage } from "../Utils/cloudinary.js";
import { PrismaClient } from "@prisma/client";

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
	try {
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
	} catch (err) {
		console.log(err);
		return res.status(500).json("Internal error");
	}
};

const getCompany = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "Company ID not found" });
		}

		const company = await prisma.company.findUnique({
			where: {
				id: parseInt(id),
			},
			include: {
				users: {
					select: {
						user: {
							select: {
								id: true,
								fname: true,
								lname: true,
								email: true,
								profile: {
									select: {
										profilePic: true,
									},
								},
							},
						},
					},
				},
				events: {
					include: {
						galleries: true,
					},
				},
			},
		});

		if (!company) {
			return res.status(404).json({ message: "Company not found" });
		}

		return res.status(200).json(company);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Internal error");
	}
};

const addCompanyAdmin = async (req: Request, res: Response) => {
	try {
		const { user_id, email } = req.body;
		const { id } = req.params;

		if (!email) {
			return res.status(400).json({ message: "User email Required" });
		}

		const company = await prisma.company.findUnique({
			where: {
				id: parseInt(id as string),
			},
			include: {
				users: true,
			},
		});

		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User Not Found" });
		}

		if (!company) {
			return res.status(404).json({ message: "Company Not Found" });
		}

		const admins = company.users.map((_user) => _user.userId);

		if (admins.indexOf(user_id) === -1) {
			return res
				.status(403)
				.json({ message: "You don't have Authorization" });
		}

		if (admins.indexOf(user.id) !== -1) {
			return res
				.status(403)
				.json({ message: "User is already an admin" });
		}

		await prisma.companyUser.create({
			data: {
				userId: user.id,
				companyId: parseInt(id as string),
			},
		});

		return res.json({ message: "Admin Added" });
	} catch (err) {
		console.log(err);
		return res.status(500).json("Internal error");
	}
};

const getUserCompanies = async (req: Request, res: Response) => {
	try {
		const { user_id } = req.body;

		const companies = await prisma.companyUser.findMany({
			where: {
				userId: user_id,
			},
			select: {
				company: {
					include: {
						_count: true,
					},
				},
			},
		});

		return res.json(companies);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Internal error");
	}
};

const deleteCompany = async (req: Request, res: Response) => {
	try {
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
	} catch (err) {
		console.log(err);
		return res.status(500).json("Internal error");
	}
};

const searchCompany = async (req: Request, res: Response) => {
	try {
		const { keyword } = req.params;
		const companies = await prisma.company.findMany({
			where: {
				name: {
					contains: keyword,
				},
			},
		});

		return res.status(200).json(companies);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Internal error");
	}
};

export const companyController = {
	addCompany,
	editCompany,
	getCompany,
	getUserCompanies,
	deleteCompany,
	searchCompany,
	addCompanyAdmin,
};
