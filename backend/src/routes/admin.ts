import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireAdmin);

// GET /admin/stats
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalTrips,
      publicTrips,
      totalCities,
      avgBudget,
      topCities,
      topActivities,
      recentUsers,
      budgetAggregate,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.trip.count({ where: { isPublic: true } }),
      prisma.city.count(),
      prisma.trip.aggregate({ _avg: { budgetLimit: true } }),
      prisma.city.findMany({
        take: 10,
        orderBy: { tripStops: { _count: "desc" } },
        include: { _count: { select: { tripStops: true } } },
      }),
      prisma.activity.findMany({
        take: 10,
        orderBy: { tripActivities: { _count: "desc" } },
        include: { _count: { select: { tripActivities: true } } },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          _count: { select: { trips: true } },
        },
      }),
      prisma.trip.aggregate({
        _avg: { budgetLimit: true },
        where: { budgetLimit: { not: null } },
      }),
    ]);

    res.json({
      totalUsers,
      totalTrips,
      publicTrips,
      totalCities,
      avgBudget: budgetAggregate._avg.budgetLimit ?? 0,
      topCities,
      topActivities,
      recentUsers,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET /admin/users?page=1&limit=20&search=
router.get("/users", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query["page"]) || 1);
    const limit = Math.min(100, Number(req.query["limit"]) || 20);
    const search = (req.query["search"] as string) || "";

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          city: true,
          role: true,
          createdAt: true,
          _count: { select: { trips: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page, limit });
  } catch {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// PUT /admin/users/:id/role
router.put("/users/:id/role", async (req: Request, res: Response) => {
  try {
    const { role } = req.body as { role: "USER" | "ADMIN" };
    if (!["USER", "ADMIN"].includes(role))
      return res.status(400).json({ error: "role must be USER or ADMIN" });

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, email: true, role: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to update role" });
  }
});

// DELETE /admin/users/:id
router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// GET /admin/cities
router.get("/cities", async (_req: Request, res: Response) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { activities: true, tripStops: true } } },
    });
    res.json(cities);
  } catch {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

// POST /admin/cities
router.post("/cities", async (req: Request, res: Response) => {
  try {
    const { name, costIndex, popularity, description, imageUrl, latitude, longitude } =
      req.body as {
        name: string;
        costIndex?: number;
        popularity?: number;
        description?: string;
        imageUrl?: string;
        latitude?: number;
        longitude?: number;
      };

    if (!name) return res.status(400).json({ error: "name required" });

    const city = await prisma.city.create({
      data: {
        name,
        costIndex: costIndex != null ? Number(costIndex) : 1.0,
        popularity: popularity != null ? Number(popularity) : 0,
        description,
        imageUrl,
        latitude: latitude != null ? Number(latitude) : undefined,
        longitude: longitude != null ? Number(longitude) : undefined,
      },
    });
    res.status(201).json(city);
  } catch {
    res.status(500).json({ error: "Failed to create city" });
  }
});

// PUT /admin/cities/:id
router.put("/cities/:id", async (req: Request, res: Response) => {
  try {
    const { name, costIndex, popularity, description, imageUrl, latitude, longitude } =
      req.body as {
        name?: string;
        costIndex?: number;
        popularity?: number;
        description?: string;
        imageUrl?: string;
        latitude?: number;
        longitude?: number;
      };

    const city = await prisma.city.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(name && { name }),
        ...(costIndex != null && { costIndex: Number(costIndex) }),
        ...(popularity != null && { popularity: Number(popularity) }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(latitude != null && { latitude: Number(latitude) }),
        ...(longitude != null && { longitude: Number(longitude) }),
      },
    });
    res.json(city);
  } catch {
    res.status(500).json({ error: "Failed to update city" });
  }
});

// DELETE /admin/cities/:id
router.delete("/cities/:id", async (req: Request, res: Response) => {
  try {
    await prisma.city.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete city" });
  }
});

// POST /admin/cities/:id/activities
router.post("/cities/:id/activities", async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);
    const { name, description, type, estimatedCost, durationHours, imageUrl } =
      req.body as {
        name: string;
        description?: string;
        type?: string;
        estimatedCost?: number;
        durationHours?: number;
        imageUrl?: string;
      };

    if (!name) return res.status(400).json({ error: "name required" });

    const activity = await prisma.activity.create({
      data: {
        cityId,
        name,
        description,
        type: (type as never) ?? "OTHER",
        estimatedCost: estimatedCost != null ? Number(estimatedCost) : 0,
        durationHours: durationHours != null ? Number(durationHours) : 1,
        imageUrl,
      },
    });
    res.status(201).json(activity);
  } catch {
    res.status(500).json({ error: "Failed to create activity" });
  }
});

// PUT /admin/activities/:id
router.put("/activities/:id", async (req: Request, res: Response) => {
  try {
    const { name, description, type, estimatedCost, durationHours, imageUrl } =
      req.body as {
        name?: string;
        description?: string;
        type?: string;
        estimatedCost?: number;
        durationHours?: number;
        imageUrl?: string;
      };

    const activity = await prisma.activity.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(type && { type: type as never }),
        ...(estimatedCost != null && { estimatedCost: Number(estimatedCost) }),
        ...(durationHours != null && { durationHours: Number(durationHours) }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });
    res.json(activity);
  } catch {
    res.status(500).json({ error: "Failed to update activity" });
  }
});

// DELETE /admin/activities/:id
router.delete("/activities/:id", async (req: Request, res: Response) => {
  try {
    await prisma.activity.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete activity" });
  }
});

export default router;
