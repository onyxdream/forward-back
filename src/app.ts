// import main dependencies
import express from "express";
import cors from "cors";
import morgan from "morgan";

// middleware
import { errorHandler } from "./middleware/errorHandler";

// routes

import { userRoutes } from "./modules/users/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { authGuard } from "./middleware/authGuard";
import { limiter, tightLimiter } from "./middleware/limiter";

const app = express();

// dependencies
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// modules
app.use(limiter, authRoutes);
app.use("/users", tightLimiter, authGuard, userRoutes);

// error handler
app.use(errorHandler);

export default app;
