import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import groupRoutes from "./routes/groupRoutes";
import cardRoutes from "./routes/cardRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/cards", cardRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Api funcionando.",
  });
});

app.use(errorMiddleware);

export default app;
