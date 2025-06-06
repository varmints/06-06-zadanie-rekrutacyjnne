import { Item } from "./item.model";

export type SortField = keyof Item;

export const allowedSortFields: SortField[] = ['id', 'name', 'category', 'date'];