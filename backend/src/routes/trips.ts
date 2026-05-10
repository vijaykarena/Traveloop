import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const trips = await prisma.trip.findMany({ include: { user: true } });
  res.json(trips);
});

router.get("/:id", async (req: Request, res: Response) => {
  const trip = await prisma.trip.findUnique({
    where: { id: Number(req.params.id) },
    include: { user: true },
  });
  if (!trip) return res.status(404).json({ error: "Trip not found" });
  res.json(trip);
});

router.post("/", async (req: Request, res: Response) => {
  const { title, destination, startDate, endDate, userId } = req.body as {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    userId: number;
  };
  if (!title || !destination || !startDate || !endDate || !userId)
    return res.status(400).json({ error: "title, destination, startDate, endDate, userId required" });
  const trip = await prisma.trip.create({
    data: {
      title,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: Number(userId),
    },
  });
  res.status(201).json(trip);
});

router.put("/:id", async (req: Request, res: Response) => {
  const { title, destination, startDate, endDate } = req.body as {
    title?: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
  };
  const trip = await prisma.trip.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(title && { title }),
      ...(destination && { destination }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    },
  });
  res.json(trip);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await prisma.trip.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
