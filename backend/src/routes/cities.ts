import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

// GET /cities?search=&page=1&limit=20&sortBy=popularity
router.get("/", async (req: Request, res: Response) => {
  try {
    const search = (req.query["search"] as string) || "";
    const page = Math.max(1, Number(req.query["page"]) || 1);
    const limit = Math.min(100, Number(req.query["limit"]) || 20);
    const sortBy = (req.query["sortBy"] as string) === "costIndex" ? "costIndex" : "popularity";

    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    const [cities, total] = await Promise.all([
      prisma.city.findMany({
        where,
        orderBy: { [sortBy]: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { activities: true, tripStops: true } } },
      }),
      prisma.city.count({ where }),
    ]);

    res.json({ cities, total, page, limit });
  } catch {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

// GET /cities/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const city = await prisma.city.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        activities: true,
        _count: { select: { tripStops: true } },
      },
    });
    if (!city) return res.status(404).json({ error: "City not found" });
    res.json(city);
  } catch {
    res.status(500).json({ error: "Failed to fetch city" });
  }
});

// GET /cities/:id/activities?type=&maxCost=&maxDuration=
router.get("/:id/activities", async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);
    const { type, maxCost, maxDuration } = req.query as Record<string, string>;

    const activities = await prisma.activity.findMany({
      where: {
        cityId,
        ...(type && { type: type as never }),
        ...(maxCost && { estimatedCost: { lte: Number(maxCost) } }),
        ...(maxDuration && { durationHours: { lte: Number(maxDuration) } }),
      },
      orderBy: { estimatedCost: "asc" },
    });

    res.json(activities);
  } catch {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

export default router;
