import express from "express";
import usersRouter from "./routes/users";
import tripsRouter from "./routes/trips";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Traveloop API" });
});

app.use("/users", usersRouter);
app.use("/trips", tripsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
