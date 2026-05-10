import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

// GET /users/me
router.get("/me", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        city: true,
        country: true,
        countryCode: true,
        phoneNo: true,
        role: true,
        avatarUrl: true,
        bio: true,
        language: true,
        currency: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /users/me
router.put("/me", async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      city,
      country,
      countryCode,
      phoneNo,
      avatarUrl,
      bio,
      language,
      currency,
      visibility,
    } = req.body as {
      firstName?: string;
      lastName?: string;
      city?: string;
      country?: string;
      countryCode?: string;
      phoneNo?: string;
      avatarUrl?: string;
      bio?: string;
      language?: string;
      currency?: string;
      visibility?: string;
    };

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(city && { city }),
        ...(country !== undefined && { country }),
        ...(countryCode !== undefined && { countryCode }),
        ...(phoneNo && { phoneNo }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bio !== undefined && { bio }),
        ...(language && { language }),
        ...(currency !== undefined && { currency }),
        ...(visibility !== undefined && { visibility }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        city: true,
        country: true,
        countryCode: true,
        phoneNo: true,
        role: true,
        avatarUrl: true,
        bio: true,
        language: true,
        currency: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// DELETE /users/me
router.delete("/me", async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// GET /users/me/saved-destinations
router.get("/me/saved-destinations", async (req: Request, res: Response) => {
  try {
    const saved = await prisma.savedDestination.findMany({
      where: { userId: req.userId },
      include: {
        city: {
          include: { activities: { select: { id: true, name: true, type: true } } },
        },
      },
    });
    res.json(saved.map((s) => s.city));
  } catch {
    res.status(500).json({ error: "Failed to fetch saved destinations" });
  }
});

// POST /users/me/saved-destinations
router.post("/me/saved-destinations", async (req: Request, res: Response) => {
  try {
    const { cityId } = req.body as { cityId: number };
    if (!cityId) return res.status(400).json({ error: "cityId required" });

    await prisma.savedDestination.upsert({
      where: { userId_cityId: { userId: req.userId!, cityId: Number(cityId) } },
      create: { userId: req.userId!, cityId: Number(cityId) },
      update: {},
    });
    res.status(201).json({ message: "Destination saved" });
  } catch {
    res.status(500).json({ error: "Failed to save destination" });
  }
});

// DELETE /users/me/saved-destinations/:cityId
router.delete(
  "/me/saved-destinations/:cityId",
  async (req: Request, res: Response) => {
    try {
      await prisma.savedDestination.delete({
        where: {
          userId_cityId: {
            userId: req.userId!,
            cityId: Number(req.params.cityId),
          },
        },
      });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to remove saved destination" });
    }
  }
);

export default router;
