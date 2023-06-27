import { PrismaClient } from "@prisma/client";
import { log } from "console";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getStat = async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.count();
		const companies = await prisma.company.count();
		const events = await prisma.event.count();
		const admins = await prisma.user.count({
			where: {
				role: "SUPERADMIN",
			},
		});
		const bookings = await prisma.booking.count({
			where: {
				approved: true,
			},
		});

		return res
			.status(200)
			.json({ users, companies, events, admins, bookings });
	} catch (e) {
		log(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const getAdmins = async (req: Request, res: Response) => {
	try {
		const admins = await prisma.user.findMany({
			where: {
				role: "SUPERADMIN",
			},
			include: {
				profile: true,
			},
		});

		const filteredInfo = admins.map((_admin) => {
			const { id, fname, lname, email, profile, ...left } = _admin;

			const { bio, profilePic } = profile || {};

			return { id, fname, lname, email, bio, profilePic };
		});

		return res.status(200).json(filteredInfo);
	} catch (e) {
		log(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const addAdmin = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res
				.status(400)
				.json({ message: "Email Required to Add Admin" });
		}

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				role: "SUPERADMIN",
			},
		});

		return res.status(200).json({ message: "Admin Added" });
	} catch (e) {
		log(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const removeAdmin = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res
				.status(400)
				.json({ message: "ID Required to Remove Admin" });
		}

		const user = await prisma.user.findUnique({
			where: {
				id: parseInt(id as string),
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				role: "USER",
			},
		});

		return res.status(200).json({ message: "Admin Removed" });
	} catch (e) {
		log(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const getAllUnapprovedTickets = async (req: Request, res: Response) => {
	try {
		const tickets = await prisma.booking.findMany({
			where: {
				approved: false,
			},
			include: {
				event: true,
			},
		});

		const newT = tickets.map((_ticket) => {
			const totalPrice =
				_ticket.economyCount * _ticket.event.economyPrice +
				_ticket.vipCount * _ticket.event.vipPrice;

			const { event, ...info } = _ticket;
			return { ...info, price: totalPrice };
		});

		return res.status(200).json(newT);
	} catch (e) {
		log(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const approveTicket = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const tickets = await prisma.booking.update({
			where: {
				id: parseInt(id),
			},
			data: {
				approved: true,
			},
		});

		return res.status(200).json({ message: "Ticket Approved" });
	} catch (e) {
		log(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const getPaymentRequests = async (req: Request, res: Response) => {
	try {
		const requests = await prisma.paymentRequest.findMany({
			where: {
				paid: false,
			},
		});

		return res.status(200).json(requests);
	} catch (e) {
		log(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const approvePaymentRequest = async (req: Request, res: Response) => {
	try {
		const { id } = req.body;
		if (!id) {
			return res.status(400).json({ message: "Id not found" });
		}

		const request = await prisma.paymentRequest.findFirst({
			where: {
				id: parseInt(id),
			},
		});

		if (!request) {
			return res.status(400).json({ message: "Request Not found" });
		}

		await prisma.paymentRequest.update({
			where: {
				id: request.id,
			},
			data: {
				paid: true,
			},
		});

		return res.status(200).json({ message: "Approved Successfully" });
	} catch (e) {
		log(e);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const adminController = {
	getStat,
	getAdmins,
	addAdmin,
	removeAdmin,
	getAllUnapprovedTickets,
	approveTicket,
	approvePaymentRequest,
	getPaymentRequests,
};
