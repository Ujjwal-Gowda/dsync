import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/authroutes.ts";
import workspacesRoutes from "./routes/workspaceRoutes.ts";
import projectRoutes from "./routes/projectsRoutes.ts";
import tasksRoutes from "./routes/tasksRoutes.ts";
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
  res.json({
    health: "/health",
    auth: "/auth",
    workspace: "/workspace",
    projects: "/projects",
    tasks: "/tasks",
  });
});

app.use("/auth", authRoutes);

app.use("/workspaces", workspacesRoutes);

app.use("/projects", projectRoutes);

app.use("/tasks", tasksRoutes);

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});

async function connectPrisma() {
  try {
    const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} ;`;

    console.log("database connected", result);
  } catch (error) {
    console.log("database disconnected", error);
  }
}
