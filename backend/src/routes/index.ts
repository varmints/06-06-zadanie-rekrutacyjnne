import { Application } from "express";
import { itemsRouter } from "../controllers/items.controller";

export function registerRoutes(app: Application): void {
  app.use('/api/items', itemsRouter);
}