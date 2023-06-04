import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

const addReview = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { user_id, comment, stars } = req.body;

		if (!comment || !stars) {
			return res
				.status(400)
				.json({ message: "Please Provide all neccesary infos" });
		}

		const event = await prisma.event.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}

		const review = await prisma.eventReview.create({
			data: {
				userId: user_id,
				eventId: event.id,
				comment,
				stars: parseInt(stars),
			},
		});

		return res.status(200).json({ message: "Rated Successfully" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const editReview = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { user_id, comment, stars } = req.body;

		const review = await prisma.eventReview.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}

		if (review.userId != parseInt(user_id)) {
			return res.status(403).json({ message: "Forbidden Access" });
		}

		const updatedReview = await prisma.eventReview.update({
			where: {
				id: review.id,
			},
			data: {
				comment,
				stars: stars && parseInt(stars),
			},
		});

		return res
			.status(200)
			.json({ message: "Updated Successfully", data: updatedReview });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const deleteReview = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { user_id } = req.body;

		const review = await prisma.eventReview.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}

		if (review.userId != parseInt(user_id)) {
			return res.status(403).json({ message: "Forbidden Access" });
		}

		const deletedReview = await prisma.eventReview.delete({
			where: {
				id: review.id,
			},
		});

		return res
			.status(200)
			.json({ message: "Deleted Successfully", data: deletedReview });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const getEventReviews = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { user_id } = req.body;

		const reviews = await prisma.eventReview.findMany({
			where: {
				eventId: parseInt(id),
			},
		});

		const ratings =
			reviews
				.map((val) => val.stars)
				.reduce((_prev, _current) => _prev + _current) / reviews.length;

		return res.json({ rating: ratings, reviews });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const reviewController = {
	addReview,
	deleteReview,
	editReview,
	getEventReviews,
};
