import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

// GET /activities?search=&type=&maxCost=&maxDuration=&cityId=&page=1&limit=20
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      search,
      type,
      maxCost,
      maxDuration,
      cityId,
      page: pageQ,
      limit: limitQ,
    } = req.query as Record<string, string>;

    const page = Math.max(1, Number(pageQ) || 1);
    const limit = Math.min(100, Number(limitQ) || 20);

    const where = {
      ...(search && { name: { contains: search, mode: "insensitive" as const } }),
      ...(type && { type: type as never }),
      ...(maxCost && { estimatedCost: { lte: Number(maxCost) } }),
      ...(maxDuration && { durationHours: { lte: Number(maxDuration) } }),
      ...(cityId && { cityId: Number(cityId) }),
    };

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { estimatedCost: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          city: { select: { id: true, name: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    res.json({ activities, total, page, limit });
  } catch (error) {
    console.error("Activities search error:", error);
    res.status(500).json({ error: "Failed to search activities" });
  }
});

export default router;
