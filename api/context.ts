import { db } from "./db";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export interface Context {
  req: Request;
  res: Response;
  db: PrismaClient;
  userId?: string | undefined;
}

export const context = ({ req, res }: { req: Request; res: Response }) => {
  return { req, res, db, userId: req.userSession.userId };
};
