import express from "express";
import dotenv from "dotenv";
import helloRoutes from "./routes/helloRoutes.js";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect("mongodb+srv://root:123456789*10@bdprueba.f2whees.mongodb.net/?appName=BdPrueba").then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/hello', helloRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
