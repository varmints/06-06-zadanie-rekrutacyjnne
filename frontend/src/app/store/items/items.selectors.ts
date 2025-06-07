import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './items.state';

export const selectItemsState = createFeatureSelector<ItemsState>('items');
export const selectAllItems = createSelector(selectItemsState, (state: ItemsState) => state.items);
export const selectTotalItems = createSelector(selectItemsState, (state: ItemsState) => state.totalItems);
export const selectPagination = createSelector(selectItemsState, (state: ItemsState) => ({
  page: state.page,
  pageSize: state.pageSize,
}));
export const selectSort = createSelector(selectItemsState, (state: ItemsState) => ({
  sortField: state.sortField,
  sortOrder: state.sortOrder,
}));
export const selectSearchTerm = createSelector(selectItemsState, (state: ItemsState) => state.searchTerm);
export const selectLoading = createSelector(selectItemsState, (state: ItemsState) => state.loading);
export const selectError = createSelector(selectItemsState, (state: ItemsState) => state.error);
export const selectItemsTableData = createSelector(
  selectAllItems,
  selectTotalItems,
  selectPagination,
  selectSort,
  selectSearchTerm,
  selectLoading,
  selectError,
  (items, totalItems, pagination, sort, searchTerm, loading, error) => ({
    items,
    totalItems,
    page: pagination.page,
    pageSize: pagination.pageSize,
    sortField: sort.sortField,
    sortOrder: sort.sortOrder,
    searchTerm,
    loading,
    error,
  })
);
