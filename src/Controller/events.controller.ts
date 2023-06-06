import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { uploadImage } from "../Utils/cloudinary.js";
import { log } from "console";

const prisma = new PrismaClient();

const addEvent = async (req: Request, res: Response) => {
	try {
		const {
			user_id,
			companyId,
			title,
			desc,
			eventStartTime,
			eventEndTime,
			eventDeadline,
			city,
			street,
			venue,
			latitude,
			longitude,
			economyPrice,
			economySeats,
			vipSeats,
			vipPrice,
			categories,
		} = req.body;

		if (
			!companyId ||
			!title ||
			!desc ||
			!eventStartTime ||
			!eventEndTime ||
			!eventDeadline ||
			!city ||
			!street ||
			!venue ||
			!latitude ||
			!longitude ||
			!economyPrice ||
			!economySeats ||
			!vipSeats ||
			!vipPrice
		) {
			return res.status(400).json({ message: "Please Enter all fields" });
		}

		const files = req.files as Express.Multer.File[];
		let filenames;
		filenames = await Promise.all(
			files.map(
				async (file) =>
					await uploadImage(file, "onReserve/Events").then((res) => ({
						eventPhoto: res?.url || "",
					}))
			)
		);

		const event = await prisma.event.create({
			data: {
				userId: parseInt(user_id),
				companyId: parseInt(companyId),
				title,
				desc,
				eventStartTime: new Date(eventStartTime),
				eventEndTime: new Date(eventEndTime),
				eventDeadline: new Date(eventDeadline),
				economyPrice: parseInt(economyPrice),
				economySeats: parseInt(economySeats),
				vipPrice: parseInt(vipPrice),
				vipSeats: parseInt(vipSeats),
				approved: false,
				categories: {
					create: Array.isArray(categories)
						? categories.map((c: string) => ({
								categoryId: parseInt(c),
						  }))
						: [
								{
									categoryId: parseInt(categories),
								},
						  ],
				},
				locations: {
					create: [
						{
							city,
							street,
							venue,
							latitude: parseFloat(latitude),
							longitude: parseFloat(longitude),
						},
					],
				},
				galleries: {
					create: filenames,
				},
			},
		});

		return res.status(200).json(event);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const editEvent = async (req: Request, res: Response) => {
	try {
		const {
			user_id,
			companyId,
			title,
			desc,
			eventStartTime,
			eventEndTime,
			eventDeadline,
			city,
			street,
			venue,
			latitude,
			longitude,
			economyPrice,
			economySeats,
			vipSeats,
			vipPrice,
		} = req.body;
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Event ID not Found" });
		}

		const event = await prisma.event.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not Found" });
		}

		const adminsList = await prisma.companyUser
			.findMany({
				where: {
					companyId: event.companyId,
				},
			})
			.then((result) => result.map((u) => u.userId));

		if (adminsList.indexOf(parseInt(user_id)) === -1) {
			return res.status(403).json({
				message: "You don't have the authority to edit this event",
			});
		}

		const updatedEvent = await prisma.event.update({
			where: {
				id: event.id,
			},
			data: {
				title,
				desc,
				eventStartTime,
				eventEndTime,
				eventDeadline,
				economyPrice: economyPrice && parseInt(economyPrice),
				economySeats: economySeats && parseInt(economySeats),
				vipPrice: vipPrice && parseInt(vipPrice),
				vipSeats: vipSeats && parseInt(vipSeats),

				locations: {
					updateMany: {
						where: {
							eventId: event.id,
						},
						data: {
							city,
							street,
							venue,
							latitude: latitude && parseFloat(latitude),
							longitude: longitude && parseFloat(longitude),
						},
					},
				},
			},

			include: {
				locations: true,
			},
		});

		return res.status(200).json(updatedEvent);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const deleteEvent = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { user_id } = req.body;

		if (!id) {
			return res.status(400).json({ message: "Event ID not Found" });
		}

		const event = await prisma.event.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not Found" });
		}

		const adminsList = await prisma.companyUser
			.findMany({
				where: {
					companyId: event.companyId,
				},
			})
			.then((result) => result.map((u) => u.userId));

		if (adminsList.indexOf(parseInt(user_id)) === -1) {
			return res.status(403).json({
				message: "You don't have the authority to delete this event",
			});
		}

		const deletedEvent = await prisma.event.delete({
			where: {
				id: parseInt(id),
			},
		});

		return res
			.status(200)
			.json({ message: "Deleted Successfully", data: deletedEvent });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const getUpcomingEvents = async (req: Request, res: Response) => {
	try {
		const { page } = req.query;
		let currentPage = undefined;

		if (!page) {
			currentPage = 1;
		} else {
			currentPage = parseInt(page as string);
		}

		const events = await prisma.event.findMany({
			where: {
				eventEndTime: {
					gte: new Date(),
				},
			},
			include: {
				galleries: true,
			},
			orderBy: {
				eventStartTime: "asc",
			},
			take: 50,
			skip: (currentPage - 1) * 50,
		});

		return res.status(200).json(events);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const getEventDetails = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Event ID not found" });
		}

		const event = await prisma.event.findUnique({
			where: {
				id: parseInt(id),
			},
			include: {
				locations: true,
				galleries: true,
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		return res.status(200).json(event);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const searchEvent = async (req: Request, res: Response) => {
	try {
		const { keyword } = req.params;
		const events = await prisma.event.findMany({
			where: {
				title: {
					contains: keyword,
				},
			},
			include: {
				locations: true,
				galleries: true,
			},
		});

		return res.status(200).json(events);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const eventController = {
	addEvent,
	editEvent,
	deleteEvent,
	getUpcomingEvents,
	getEventDetails,
	searchEvent,
};
