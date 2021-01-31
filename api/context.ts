import { db } from "./db";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";

export interface Context {
  db: PrismaClient;
}

export const context = (req: Request) => {
  return { ...req, db };
};
