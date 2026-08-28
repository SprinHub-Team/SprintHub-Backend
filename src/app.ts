import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import groupRoutes from "./routes/groupRoutes";
import cardRoutes from "./routes/cardRoutes";
import boardRoutes from "./routes/boardRoutes";
import columnRoutes from "./routes/columnRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Api funcionando.",
  });
});

app.use(errorMiddleware);

export default app;
