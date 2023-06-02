import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { uploadImage } from "../Utils/cloudinary.js";

const prisma = new PrismaClient();

const addEvent = async (req: Request, res: Response) => {
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

  const filenames = await Promise.all(
    files?.map(
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
      eventStartTime,
      eventEndTime,
      eventDeadline,
      economyPrice: parseInt(economyPrice),
      economySeats: parseInt(economySeats),
      vipPrice: parseInt(vipPrice),
      vipSeats: parseInt(vipSeats),
      approved: false,
      categories: {
        connect: categories.map((c: Number) => ({
          categoryId: c,
          eventId: event.id,
        })),
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
};

const editEvent = async (req: Request, res: Response) => {
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
};

const deleteEvent = async (req: Request, res: Response) => {
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
};

const getUpcomingEvents = async (req: Request, res: Response) => {
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
};

const getEventDetails = async (req: Request, res: Response) => {
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
};

const searchEvent = async (req: Request, res: Response) => {
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
};

export const eventController = {
  addEvent,
  editEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventDetails,
  searchEvent,
};
