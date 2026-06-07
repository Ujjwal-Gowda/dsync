import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/authroutes.ts";
import prisma from "./config/prisma.ts";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

const PORT = process.env.PORT;

app.get("/health", (req, res) => {
  res.json({ message: "healthy" });
});

app.get("/api", (req, res) => {
  res.json({ health: "/health", auth: "/auth" });
});

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});

async function connectPrisma() {
  try {
    await prisma.$queryRaw(`SELECT 1`);
    console.log("database connected");
  } catch (error) {
    console.log("database disconnected", error);
  }
}
