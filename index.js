// packages
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

//routes
import userRoutes from "./routes/userRoutes.js";

//utils
import connectDB from "./config/db.js";
import { log } from "console";

dotenv.config();
const port = process.env.PORT;

//connect to database
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
