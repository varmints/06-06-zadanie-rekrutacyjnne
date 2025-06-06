import { Router, Request, Response, NextFunction } from "express";
import mockData from '../data/mockData.json';
import { Item } from "../models/item.model";
import { getItems } from "../services/items.service";
import { parseGetItemsQuery } from "../utils/parse-get-items-query";
import { NotFoundError } from "../errors/app-error";

export const itemsRouter = Router();

const data: Item[] = mockData as unknown as Item[];

itemsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = parseGetItemsQuery(req);
    const result = getItems(data, params);
  
    res.json(result);
  } catch (error) {
    next(error);
  }
});

itemsRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const idParam = req.params.id;
  const id = parseInt(idParam, 10);

  if (isNaN(id)) {
    console.error(`Invalid ID: ${idParam} is not a number.`);
    return next(new NotFoundError('ID must be a number.'));
  }

  const item = data.find(item => item.id === id);

  if (!item) {
    console.error(`Item not found: No item with ID ${id}.`);
    return next(new NotFoundError('Item not found.'));
  }
  
 item 
    ? res.json(item)
    : res.status(404).json({ message: 'Item not found' });
})