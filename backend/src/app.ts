import express from "express";
import usersRouter from "./routes/users";
import tripsRouter from "./routes/trips";
import authRouter from "./routes/auth";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (_req, res) => {
  res.json({ message: "Traveloop API" });
});

app.use("/users", usersRouter);
app.use("/trips", tripsRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
