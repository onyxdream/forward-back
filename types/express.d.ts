import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; admin: boolean }; // Replace `any` with your user type
      token?: string;
    }
  }
}
