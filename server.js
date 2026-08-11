import express from "express";
import dotenv from "dotenv";
import helloRoutes from "./routes/helloRoutes.js";
import mongoose from "mongoose";
import fs from 'fs';
import cors from 'cors';

dotenv.config();

mongoose.connect("mongodb+srv://root:123456789*10@bdprueba.f2whees.mongodb.net/?appName=BdPrueba").then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/hello', helloRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
