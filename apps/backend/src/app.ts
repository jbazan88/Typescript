import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/libros", bookRoutes);

app.get("/", (_req, res) => res.send("API de Librería funcionando"));

export default app;