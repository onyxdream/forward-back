import z from "zod";
import { Request, Response } from "express";

export type CrudModel = {
  schema: z.ZodObject<any>;
  createSchema: z.ZodObject<any>;
  updateSchema: z.ZodObject<any>;
};

export type CrudRepository = {
  create: (user_id: string, data: any) => Promise<any>;
  getById: (user_id: string, id: string) => Promise<any>;
  getByUserId: (user_id: string) => Promise<any[]>;
  update: (user_id: string, id: string, data: any) => Promise<any>;
  remove: (user_id: string, id: string) => Promise<void>;
};

export type CrudController = {
  create: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  getByUserId: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  remove: (req: Request, res: Response) => Promise<void>;
};

export type CrudService = {
  create: (user_id: string, data: any) => Promise<any>;
  getById: (user_id: string, id: string) => Promise<any>;
  getByUserId: (user_id: string) => Promise<any[]>;
  update: (user_id: string, id: string, data: any) => Promise<any>;
  remove: (user_id: string, id: string) => Promise<void>;
};

export type CrudConstructor = {
  tableName: string;
  schema: z.ZodObject<any>;
  endpoint: string;
};
