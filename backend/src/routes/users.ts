import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

// @route   GET /users
// @desc    Get all users
// @access  Private (Admin only - TBD)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
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
        createdAt: true,
        updatedAt: true,
        trips: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// @route   GET /users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
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
        createdAt: true,
        updatedAt: true,
        trips: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// @route   PUT /users/:id
// @desc    Update user
// @access  Private
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const {
      email,
      firstName,
      lastName,
      city,
      country,
      countryCode,
      phoneNo,
    } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(city && { city }),
        ...(country && { country }),
        ...(countryCode && { countryCode }),
        ...(phoneNo && { phoneNo }),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// @route   DELETE /users/:id
// @desc    Delete user
// @access  Private
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
