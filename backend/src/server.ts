import express, { Application } from "express";
import cors from 'cors';
import { registerRoutes } from './routes';
import { loggerMiddleware } from './middlewares/logger';
import { errorHandler } from "./middlewares/error-handler";

export async function createServer(): Promise<Application> {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  app.use(loggerMiddleware);
  registerRoutes(app);
  app.use(errorHandler);

  return app;
}