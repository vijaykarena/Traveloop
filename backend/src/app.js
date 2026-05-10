const express = require("express");
const prisma = require("./lib/prisma");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Traveloop API" });
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { trips: true } });
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({ data: { email, name } });
  res.status(201).json(user);
});

app.get("/trips", async (req, res) => {
  const trips = await prisma.trip.findMany({ include: { user: true } });
  res.json(trips);
});

app.post("/trips", async (req, res) => {
  const { title, destination, startDate, endDate, userId } = req.body;
  const trip = await prisma.trip.create({
    data: { title, destination, startDate: new Date(startDate), endDate: new Date(endDate), userId },
  });
  res.status(201).json(trip);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
