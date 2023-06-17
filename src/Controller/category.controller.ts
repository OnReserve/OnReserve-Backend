import { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

async function addCategory(req: Request, res: Response) {
	try {
		const { name } = req.body;

		if (name === undefined) {
			return res.status(400).json({ error: "Name field Missing" });
		}

		const category: any = await prisma.category.create({
			data: {
				name,
			},
			include: {
				events: true,
			},
		});

		return res.status(200).json(category);
	} catch (error) {
		return res.status(200).json({ message: "Please Enter valid data" });
	}
}

async function allCategories(req: Request, res: Response) {
	try {
		const categories = await prisma.category.findMany({
			include: {
				_count: true,
			},
		});

		return res.status(200).json(categories);
	} catch (error) {
		return res.status(500).json({ message: "Internal Error Occured" });
	}
}

async function getCategory(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const category = await prisma.category.findUnique({
			where: {
				id,
			},
			include: {
				events: true,
			},
		});

		if (category) {
			return res.status(200).json(category);
		}

		return res.status(200).json({ message: "Category Not Found" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Category Not Found" });
	}
}

async function deleteCategory(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const category = await prisma.category.delete({
			where: {
				id,
			},
			include: { events: true },
		});

		return res.status(200).json({ message: "Category Deleted" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Category Not Found" });
	}
}

async function updateCategory(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);

		const { name } = req.body;

		const category = await prisma.category.update({
			where: {
				id,
			},
			data: {
				name,
				updatedAt: new Date(),
			},
			include: {
				events: true,
			},
		});
		return res.status(200).json(category);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Please Enter valid data" });
	}
}

const categoryController = {
	addCategory,
	allCategories,
	getCategory,
	deleteCategory,
	updateCategory,
};

export default categoryController;
