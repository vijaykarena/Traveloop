import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

// ── helpers ───────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

async function assertOwner(
  tripId: number,
  userId: number,
  res: Response
): Promise<boolean> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });
  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return false;
  }
  if (trip.userId !== userId) {
    res.status(403).json({ error: "Not authorized" });
    return false;
  }
  return true;
}

async function assertStopOwner(
  stopId: number,
  tripId: number,
  res: Response
): Promise<boolean> {
  const stop = await prisma.tripStop.findUnique({
    where: { id: stopId },
    select: { tripId: true },
  });
  if (!stop || stop.tripId !== tripId) {
    res.status(404).json({ error: "Stop not found" });
    return false;
  }
  return true;
}

// ── public route (no auth) ────────────────────────────────────────────────────

// GET /trips/public/:slug
router.get("/public/:slug", async (req: Request, res: Response) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { publicSlug: String(req.params["slug"]), isPublic: true },
      include: {
        user: { select: { firstName: true, lastName: true, avatarUrl: true } },
        stops: {
          orderBy: { order: "asc" },
          include: {
            city: true,
            activities: { include: { activity: true } },
            accommodation: true,
          },
        },
        transports: true,
      },
    });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch {
    res.status(500).json({ error: "Failed to fetch trip" });
  }
});

// ── auth required for all routes below ───────────────────────────────────────

router.use(authenticate);

// ── trip CRUD ─────────────────────────────────────────────────────────────────

// GET /trips  — current user's trips
router.get("/", async (req: Request, res: Response) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.userId },
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        destination: true,
        description: true,
        coverPhotoUrl: true,
        startDate: true,
        endDate: true,
        isPublic: true,
        publicSlug: true,
        budgetLimit: true,
        createdAt: true,
        _count: { select: { stops: true } },
      },
    });
    res.json(trips);
  } catch {
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

// POST /trips
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, destination, description, coverPhotoUrl, startDate, endDate, budgetLimit } =
      req.body as {
        title: string;
        destination?: string;
        description?: string;
        coverPhotoUrl?: string;
        startDate: string;
        endDate: string;
        budgetLimit?: number;
      };

    if (!title || !startDate || !endDate)
      return res.status(400).json({ error: "title, startDate, endDate required" });

    const trip = await prisma.trip.create({
      data: {
        title,
        destination,
        description,
        coverPhotoUrl,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budgetLimit: budgetLimit ? Number(budgetLimit) : undefined,
        userId: req.userId!,
      },
    });
    res.status(201).json(trip);
  } catch {
    res.status(500).json({ error: "Failed to create trip" });
  }
});

// GET /trips/:id  — full detail
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: {
            city: true,
            activities: { include: { activity: true } },
            accommodation: true,
          },
        },
        transports: true,
        expenses: { orderBy: { expenseDate: "desc" } },
        notes: { orderBy: { createdAt: "desc" } },
        packing: { orderBy: { order: "asc" } },
      },
    });
    res.json(trip);
  } catch {
    res.status(500).json({ error: "Failed to fetch trip" });
  }
});

// PUT /trips/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const {
      title,
      destination,
      description,
      coverPhotoUrl,
      startDate,
      endDate,
      budgetLimit,
      isPublic,
    } = req.body as {
      title?: string;
      destination?: string;
      description?: string;
      coverPhotoUrl?: string;
      startDate?: string;
      endDate?: string;
      budgetLimit?: number | null;
      isPublic?: boolean;
    };

    let publicSlug: string | null | undefined;
    if (isPublic === true) {
      const existing = await prisma.trip.findUnique({
        where: { id: tripId },
        select: { publicSlug: true },
      });
      publicSlug = existing?.publicSlug ?? slugify(title ?? "trip");
    } else if (isPublic === false) {
      publicSlug = null;
    }

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...(title && { title }),
        ...(destination !== undefined && { destination }),
        ...(description !== undefined && { description }),
        ...(coverPhotoUrl !== undefined && { coverPhotoUrl }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(budgetLimit !== undefined && { budgetLimit }),
        ...(isPublic !== undefined && { isPublic }),
        ...(publicSlug !== undefined && { publicSlug }),
      },
    });
    res.json(trip);
  } catch {
    res.status(500).json({ error: "Failed to update trip" });
  }
});

// DELETE /trips/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;
    await prisma.trip.delete({ where: { id: tripId } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

// GET /trips/:id/budget
router.get("/:id/budget", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          include: {
            accommodation: true,
            activities: { include: { activity: true } },
          },
        },
        transports: true,
        expenses: true,
      },
    });

    let accommodationCost = 0;
    let activitiesCost = 0;

    for (const stop of trip!.stops) {
      if (stop.accommodation) {
        const nights = Math.max(
          1,
          Math.ceil(
            (stop.accommodation.checkOut.getTime() -
              stop.accommodation.checkIn.getTime()) /
              86400000
          )
        );
        accommodationCost += stop.accommodation.costPerNight * nights;
      }
      for (const ta of stop.activities) {
        activitiesCost += ta.actualCost ?? ta.activity.estimatedCost;
      }
    }

    const transportCost = trip!.transports.reduce((s, t) => s + t.cost, 0);
    const expensesCost = trip!.expenses.reduce((s, e) => s + e.amount, 0);
    const total = accommodationCost + activitiesCost + transportCost + expensesCost;

    const tripDays = Math.max(
      1,
      Math.ceil(
        (trip!.endDate.getTime() - trip!.startDate.getTime()) / 86400000
      )
    );

    res.json({
      budgetLimit: trip!.budgetLimit,
      total,
      overBudget: trip!.budgetLimit != null ? total > trip!.budgetLimit : false,
      avgCostPerDay: total / tripDays,
      breakdown: {
        accommodation: accommodationCost,
        activities: activitiesCost,
        transport: transportCost,
        expenses: expensesCost,
      },
    });
  } catch {
    res.status(500).json({ error: "Failed to compute budget" });
  }
});

// ── stops ─────────────────────────────────────────────────────────────────────

// POST /trips/:id/stops/reorder  (must be before /:stopId routes)
router.post("/:id/stops/reorder", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const { order } = req.body as {
      order: { stopId: number; order: number }[];
    };
    if (!Array.isArray(order))
      return res.status(400).json({ error: "order array required" });

    await Promise.all(
      order.map((item) =>
        prisma.tripStop.update({
          where: { id: item.stopId },
          data: { order: item.order },
        })
      )
    );
    res.json({ message: "Stops reordered" });
  } catch {
    res.status(500).json({ error: "Failed to reorder stops" });
  }
});

// POST /trips/:id/stops
router.post("/:id/stops", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const { cityId, order, arrivalDate, departureDate, notes } = req.body as {
      cityId: number;
      order: number;
      arrivalDate: string;
      departureDate: string;
      notes?: string;
    };

    if (!cityId || order == null || !arrivalDate || !departureDate)
      return res
        .status(400)
        .json({ error: "cityId, order, arrivalDate, departureDate required" });

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId: Number(cityId),
        order: Number(order),
        arrivalDate: new Date(arrivalDate),
        departureDate: new Date(departureDate),
        notes,
      },
      include: { city: true },
    });
    res.status(201).json(stop);
  } catch {
    res.status(500).json({ error: "Failed to add stop" });
  }
});

// PUT /trips/:id/stops/:stopId
router.put("/:id/stops/:stopId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    const stopId = Number(req.params.stopId);
    if (!(await assertOwner(tripId, req.userId!, res))) return;
    if (!(await assertStopOwner(stopId, tripId, res))) return;

    const { cityId, order, arrivalDate, departureDate, notes } = req.body as {
      cityId?: number;
      order?: number;
      arrivalDate?: string;
      departureDate?: string;
      notes?: string;
    };

    const stop = await prisma.tripStop.update({
      where: { id: stopId },
      data: {
        ...(cityId && { cityId: Number(cityId) }),
        ...(order != null && { order: Number(order) }),
        ...(arrivalDate && { arrivalDate: new Date(arrivalDate) }),
        ...(departureDate && { departureDate: new Date(departureDate) }),
        ...(notes !== undefined && { notes }),
      },
      include: { city: true },
    });
    res.json(stop);
  } catch {
    res.status(500).json({ error: "Failed to update stop" });
  }
});

// DELETE /trips/:id/stops/:stopId
router.delete("/:id/stops/:stopId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    const stopId = Number(req.params.stopId);
    if (!(await assertOwner(tripId, req.userId!, res))) return;
    if (!(await assertStopOwner(stopId, tripId, res))) return;

    await prisma.tripStop.delete({ where: { id: stopId } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete stop" });
  }
});

// ── stop activities ───────────────────────────────────────────────────────────

// POST /trips/:id/stops/:stopId/activities
router.post(
  "/:id/stops/:stopId/activities",
  async (req: Request, res: Response) => {
    try {
      const tripId = Number(req.params.id);
      const stopId = Number(req.params.stopId);
      if (!(await assertOwner(tripId, req.userId!, res))) return;
      if (!(await assertStopOwner(stopId, tripId, res))) return;

      const { activityId, scheduledDate, actualCost, notes } = req.body as {
        activityId: number;
        scheduledDate?: string;
        actualCost?: number;
        notes?: string;
      };

      if (!activityId)
        return res.status(400).json({ error: "activityId required" });

      const ta = await prisma.tripActivity.create({
        data: {
          tripStopId: stopId,
          activityId: Number(activityId),
          scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
          actualCost: actualCost != null ? Number(actualCost) : undefined,
          notes,
        },
        include: { activity: true },
      });
      res.status(201).json(ta);
    } catch {
      res.status(500).json({ error: "Failed to add activity" });
    }
  }
);

// PUT /trips/:id/stops/:stopId/activities/:actId
router.put(
  "/:id/stops/:stopId/activities/:actId",
  async (req: Request, res: Response) => {
    try {
      const tripId = Number(req.params.id);
      const stopId = Number(req.params.stopId);
      const actId = Number(req.params.actId);
      if (!(await assertOwner(tripId, req.userId!, res))) return;
      if (!(await assertStopOwner(stopId, tripId, res))) return;

      const { scheduledDate, actualCost, notes } = req.body as {
        scheduledDate?: string;
        actualCost?: number;
        notes?: string;
      };

      const ta = await prisma.tripActivity.update({
        where: { id: actId },
        data: {
          ...(scheduledDate !== undefined && {
            scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
          }),
          ...(actualCost !== undefined && { actualCost }),
          ...(notes !== undefined && { notes }),
        },
        include: { activity: true },
      });
      res.json(ta);
    } catch {
      res.status(500).json({ error: "Failed to update activity" });
    }
  }
);

// DELETE /trips/:id/stops/:stopId/activities/:actId
router.delete(
  "/:id/stops/:stopId/activities/:actId",
  async (req: Request, res: Response) => {
    try {
      const tripId = Number(req.params.id);
      const stopId = Number(req.params.stopId);
      const actId = Number(req.params.actId);
      if (!(await assertOwner(tripId, req.userId!, res))) return;
      if (!(await assertStopOwner(stopId, tripId, res))) return;

      await prisma.tripActivity.delete({ where: { id: actId } });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to remove activity" });
    }
  }
);

// ── accommodation ─────────────────────────────────────────────────────────────

// POST /trips/:id/stops/:stopId/accommodation
router.post(
  "/:id/stops/:stopId/accommodation",
  async (req: Request, res: Response) => {
    try {
      const tripId = Number(req.params.id);
      const stopId = Number(req.params.stopId);
      if (!(await assertOwner(tripId, req.userId!, res))) return;
      if (!(await assertStopOwner(stopId, tripId, res))) return;

      const { name, address, checkIn, checkOut, costPerNight, bookingRef, notes } =
        req.body as {
          name: string;
          address?: string;
          checkIn: string;
          checkOut: string;
          costPerNight: number;
          bookingRef?: string;
          notes?: string;
        };

      if (!name || !checkIn || !checkOut || costPerNight == null)
        return res
          .status(400)
          .json({ error: "name, checkIn, checkOut, costPerNight required" });

      const acc = await prisma.tripAccommodation.upsert({
        where: { tripStopId: stopId },
        create: {
          tripStopId: stopId,
          name,
          address,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          costPerNight: Number(costPerNight),
          bookingRef,
          notes,
        },
        update: {
          name,
          address,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          costPerNight: Number(costPerNight),
          bookingRef,
          notes,
        },
      });
      res.status(201).json(acc);
    } catch {
      res.status(500).json({ error: "Failed to save accommodation" });
    }
  }
);

// PUT /trips/:id/stops/:stopId/accommodation
router.put(
  "/:id/stops/:stopId/accommodation",
  async (req: Request, res: Response) => {
    try {
      const tripId = Number(req.params.id);
      const stopId = Number(req.params.stopId);
      if (!(await assertOwner(tripId, req.userId!, res))) return;
      if (!(await assertStopOwner(stopId, tripId, res))) return;

      const { name, address, checkIn, checkOut, costPerNight, bookingRef, notes } =
        req.body as {
          name?: string;
          address?: string;
          checkIn?: string;
          checkOut?: string;
          costPerNight?: number;
          bookingRef?: string;
          notes?: string;
        };

      const acc = await prisma.tripAccommodation.update({
        where: { tripStopId: stopId },
        data: {
          ...(name && { name }),
          ...(address !== undefined && { address }),
          ...(checkIn && { checkIn: new Date(checkIn) }),
          ...(checkOut && { checkOut: new Date(checkOut) }),
          ...(costPerNight != null && { costPerNight: Number(costPerNight) }),
          ...(bookingRef !== undefined && { bookingRef }),
          ...(notes !== undefined && { notes }),
        },
      });
      res.json(acc);
    } catch {
      res.status(500).json({ error: "Failed to update accommodation" });
    }
  }
);

// DELETE /trips/:id/stops/:stopId/accommodation
router.delete(
  "/:id/stops/:stopId/accommodation",
  async (req: Request, res: Response) => {
    try {
      const tripId = Number(req.params.id);
      const stopId = Number(req.params.stopId);
      if (!(await assertOwner(tripId, req.userId!, res))) return;
      if (!(await assertStopOwner(stopId, tripId, res))) return;

      await prisma.tripAccommodation.delete({ where: { tripStopId: stopId } });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete accommodation" });
    }
  }
);

// ── transport ─────────────────────────────────────────────────────────────────

// GET /trips/:id/transport
router.get("/:id/transport", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;
    const transports = await prisma.tripTransport.findMany({
      where: { tripId },
      include: {
        fromStop: { include: { city: true } },
        toStop: { include: { city: true } },
      },
    });
    res.json(transports);
  } catch {
    res.status(500).json({ error: "Failed to fetch transport" });
  }
});

// POST /trips/:id/transport
router.post("/:id/transport", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const {
      fromStopId,
      toStopId,
      mode,
      carrier,
      departureTime,
      arrivalTime,
      cost,
      bookingRef,
      notes,
    } = req.body as {
      fromStopId?: number;
      toStopId?: number;
      mode?: string;
      carrier?: string;
      departureTime?: string;
      arrivalTime?: string;
      cost?: number;
      bookingRef?: string;
      notes?: string;
    };

    const transport = await prisma.tripTransport.create({
      data: {
        tripId,
        fromStopId: fromStopId ? Number(fromStopId) : undefined,
        toStopId: toStopId ? Number(toStopId) : undefined,
        mode: (mode as never) ?? "OTHER",
        carrier,
        departureTime: departureTime ? new Date(departureTime) : undefined,
        arrivalTime: arrivalTime ? new Date(arrivalTime) : undefined,
        cost: cost != null ? Number(cost) : 0,
        bookingRef,
        notes,
      },
    });
    res.status(201).json(transport);
  } catch {
    res.status(500).json({ error: "Failed to add transport" });
  }
});

// PUT /trips/:id/transport/:tId
router.put("/:id/transport/:tId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const tId = Number(req.params.tId);
    const {
      fromStopId,
      toStopId,
      mode,
      carrier,
      departureTime,
      arrivalTime,
      cost,
      bookingRef,
      notes,
    } = req.body as {
      fromStopId?: number | null;
      toStopId?: number | null;
      mode?: string;
      carrier?: string;
      departureTime?: string | null;
      arrivalTime?: string | null;
      cost?: number;
      bookingRef?: string;
      notes?: string;
    };

    const transport = await prisma.tripTransport.update({
      where: { id: tId },
      data: {
        ...(fromStopId !== undefined && { fromStopId }),
        ...(toStopId !== undefined && { toStopId }),
        ...(mode && { mode: mode as never }),
        ...(carrier !== undefined && { carrier }),
        ...(departureTime !== undefined && {
          departureTime: departureTime ? new Date(departureTime) : null,
        }),
        ...(arrivalTime !== undefined && {
          arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
        }),
        ...(cost != null && { cost: Number(cost) }),
        ...(bookingRef !== undefined && { bookingRef }),
        ...(notes !== undefined && { notes }),
      },
    });
    res.json(transport);
  } catch {
    res.status(500).json({ error: "Failed to update transport" });
  }
});

// DELETE /trips/:id/transport/:tId
router.delete("/:id/transport/:tId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    await prisma.tripTransport.delete({ where: { id: Number(req.params.tId) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete transport" });
  }
});

// ── expenses ──────────────────────────────────────────────────────────────────

// GET /trips/:id/expenses
router.get("/:id/expenses", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;
    const expenses = await prisma.tripExpense.findMany({
      where: { tripId },
      orderBy: { expenseDate: "desc" },
      include: { tripStop: { include: { city: true } } },
    });
    res.json(expenses);
  } catch {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// POST /trips/:id/expenses
router.post("/:id/expenses", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const { tripStopId, category, description, amount, expenseDate } =
      req.body as {
        tripStopId?: number;
        category?: string;
        description?: string;
        amount: number;
        expenseDate?: string;
      };

    if (amount == null)
      return res.status(400).json({ error: "amount required" });

    const expense = await prisma.tripExpense.create({
      data: {
        tripId,
        tripStopId: tripStopId ? Number(tripStopId) : undefined,
        category: (category as never) ?? "MEAL",
        description,
        amount: Number(amount),
        expenseDate: expenseDate ? new Date(expenseDate) : undefined,
      },
    });
    res.status(201).json(expense);
  } catch {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// PUT /trips/:id/expenses/:eId
router.put("/:id/expenses/:eId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const { category, description, amount, expenseDate } = req.body as {
      category?: string;
      description?: string;
      amount?: number;
      expenseDate?: string | null;
    };

    const expense = await prisma.tripExpense.update({
      where: { id: Number(req.params.eId) },
      data: {
        ...(category && { category: category as never }),
        ...(description !== undefined && { description }),
        ...(amount != null && { amount: Number(amount) }),
        ...(expenseDate !== undefined && {
          expenseDate: expenseDate ? new Date(expenseDate) : null,
        }),
      },
    });
    res.json(expense);
  } catch {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// DELETE /trips/:id/expenses/:eId
router.delete("/:id/expenses/:eId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    await prisma.tripExpense.delete({ where: { id: Number(req.params.eId) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// ── packing ───────────────────────────────────────────────────────────────────

// GET /trips/:id/packing
router.get("/:id/packing", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;
    const items = await prisma.packingItem.findMany({
      where: { tripId, userId: req.userId },
      orderBy: { order: "asc" },
    });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch packing list" });
  }
});

// POST /trips/:id/packing/reset  (must be before /:itemId)
router.post("/:id/packing/reset", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    await prisma.packingItem.updateMany({
      where: { tripId, userId: req.userId },
      data: { isPacked: false },
    });
    res.json({ message: "Packing list reset" });
  } catch {
    res.status(500).json({ error: "Failed to reset packing list" });
  }
});

// POST /trips/:id/packing
router.post("/:id/packing", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const { name, category, order } = req.body as {
      name: string;
      category?: string;
      order?: number;
    };

    if (!name) return res.status(400).json({ error: "name required" });

    const item = await prisma.packingItem.create({
      data: {
        tripId,
        userId: req.userId!,
        name,
        category: (category as never) ?? "OTHER",
        order: order != null ? Number(order) : 0,
      },
    });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Failed to add packing item" });
  }
});

// PUT /trips/:id/packing/:itemId
router.put("/:id/packing/:itemId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const { name, category, isPacked, order } = req.body as {
      name?: string;
      category?: string;
      isPacked?: boolean;
      order?: number;
    };

    const item = await prisma.packingItem.update({
      where: { id: Number(req.params.itemId) },
      data: {
        ...(name && { name }),
        ...(category && { category: category as never }),
        ...(isPacked !== undefined && { isPacked }),
        ...(order != null && { order: Number(order) }),
      },
    });
    res.json(item);
  } catch {
    res.status(500).json({ error: "Failed to update packing item" });
  }
});

// DELETE /trips/:id/packing/:itemId
router.delete("/:id/packing/:itemId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    await prisma.packingItem.delete({ where: { id: Number(req.params.itemId) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete packing item" });
  }
});

// ── notes ─────────────────────────────────────────────────────────────────────

// GET /trips/:id/notes
router.get("/:id/notes", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;
    const notes = await prisma.tripNote.findMany({
      where: { tripId, userId: req.userId },
      orderBy: { noteDate: "desc" },
    });
    res.json(notes);
  } catch {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST /trips/:id/notes
router.post("/:id/notes", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const { title, content, noteDate } = req.body as {
      title?: string;
      content: string;
      noteDate?: string;
    };

    if (!content) return res.status(400).json({ error: "content required" });

    const note = await prisma.tripNote.create({
      data: {
        tripId,
        userId: req.userId!,
        title,
        content,
        noteDate: noteDate ? new Date(noteDate) : undefined,
      },
    });
    res.status(201).json(note);
  } catch {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// PUT /trips/:id/notes/:noteId
router.put("/:id/notes/:noteId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    const { title, content, noteDate } = req.body as {
      title?: string;
      content?: string;
      noteDate?: string | null;
    };

    const note = await prisma.tripNote.update({
      where: { id: Number(req.params.noteId) },
      data: {
        ...(title !== undefined && { title }),
        ...(content && { content }),
        ...(noteDate !== undefined && {
          noteDate: noteDate ? new Date(noteDate) : null,
        }),
      },
    });
    res.json(note);
  } catch {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// DELETE /trips/:id/notes/:noteId
router.delete("/:id/notes/:noteId", async (req: Request, res: Response) => {
  try {
    const tripId = Number(req.params.id);
    if (!(await assertOwner(tripId, req.userId!, res))) return;

    await prisma.tripNote.delete({ where: { id: Number(req.params.noteId) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
