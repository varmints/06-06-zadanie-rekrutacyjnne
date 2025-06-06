import { SortOrder } from "./sort-order.model";

export interface GetItemsParams {
  page: number;
  pageSize: number;
  search: string;
  sortField: string;
  sortOrder: SortOrder;
}