import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { generateRandomToken } from "../Utils/qr_generator.js";
import QRCode from "qrcode";
import { uploadQR } from "../Utils/cloudinary.js";
import { log } from "console";

const prisma = new PrismaClient();
const addBooking = async (req: Request, res: Response) => {
	try {
		const { user_id, eventId, economyCount, vipCount } = req.body;

		if (!eventId) {
			return res.status(400).json({ message: "Event Required" });
		}

		const bookingToken = generateRandomToken();
		const qrCode = await QRCode.toDataURL(
			JSON.stringify({ bookingToken, eventId, userId: user_id })
		);
		const url = await uploadQR(qrCode, "onReserve/Bookings").then(
			(res) => res.url
		);

		const booking = await prisma.booking.create({
			data: {
				eventId: parseInt(eventId),
				economyCount: parseInt(economyCount),
				vipCount: parseInt(vipCount),
				bookingToken: bookingToken,
				completed: false,
				qrcode: url,
				userId: user_id,
			},
		});

		return res.status(200).json(booking);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Internal error");
	}
};

const getBookings = async (req: Request, res: Response) => {
	try {
		const { user_id } = req.body;

		const bookings = await prisma.booking.findMany({
			where: {
				userId: user_id,
			},
			include: {
				event: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return res.status(200).json(bookings);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const getBookingDetails = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { user_id } = req.body;

		if (!id) {
			return res.status(400).json({ message: "ID not found" });
		}

		const booking = await prisma.booking.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}

		if (booking.userId != user_id) {
			return res
				.status(403)
				.json({ message: "You don't have the Authorization to view" });
		}

		const bookingDetails = await prisma.booking.findUnique({
			where: {
				id: parseInt(id),
			},
			include: {
				event: {
					include: {
						locations: true,
						galleries: true,
					},
				},
			},
		});

		return res.status(200).json(bookingDetails);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const checkBooking = async (req: Request, res: Response) => {
	try {
		const { bookingToken, user_id } = req.body;

		if (!bookingToken) {
			return res.status(400).json({ message: "Booking Token Not Found" });
		}

		const booking = await prisma.booking.findFirst({
			where: {
				bookingToken,
			},
			include: {
				event: {
					select: {
						company: {
							select: {
								users: {
									select: {
										userId: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!booking) {
			return res.status(400).json({ message: "Invalid Booking Token" });
		}

		if (booking.completed) {
			return res
				.status(400)
				.json({ message: "Booking already checked out" });
		}

		const adminIDs = booking.event.company.users.map(
			(_admin) => _admin.userId
		);

		if (adminIDs.indexOf(user_id) == -1) {
			return res.status(403).json({
				message: "You're not Authorized to check this ticket",
			});
		}

		const updated = await prisma.booking.update({
			where: {
				id: booking.id,
			},
			data: {
				completed: true,
			},
		});

		return res
			.status(200)
			.json({ message: "Booking Successfully Checked" });
	} catch (error) {
		log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const bookingController = {
	addBooking,
	getBookings,
	getBookingDetails,
	checkBooking,
};
