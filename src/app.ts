// import main dependencies
import express from "express";
import cors from "cors";
import morgan from "morgan";

// middleware
import { errorHandler } from "./middleware/errorHandler";

// routes

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(errorHandler);

export default app;
