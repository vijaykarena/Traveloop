import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({ include: { trips: true } });
  res.json(users);
});

router.get("/:id", async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: { trips: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/", async (req: Request, res: Response) => {
  const { email, name } = req.body as { email: string; name: string };
  if (!email || !name) return res.status(400).json({ error: "email and name required" });
  const user = await prisma.user.create({ data: { email, name } });
  res.status(201).json(user);
});

router.put("/:id", async (req: Request, res: Response) => {
  const { email, name } = req.body as { email?: string; name?: string };
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { ...(email && { email }), ...(name && { name }) },
  });
  res.json(user);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
