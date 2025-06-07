import { Item } from '../../models/item.model';

export interface ItemsState {
  items: Item[];
  totalItems: number;
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  loading: boolean;
  error: any;
}

export const initialItemsState: ItemsState = {
  items: [],
  totalItems: 0,
  page: 0,
  pageSize: 10,
  sortField: 'name',
  sortOrder: 'asc',
  searchTerm: '',
  loading: false,
  error: null,
};
