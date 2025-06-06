import { Item } from './item.model';

export interface GetItemsResponse {
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  data: Item[];
  sortField: string;
  sortOrder: string;
}
