import { createReducer, on } from '@ngrx/store';
import * as ItemsActions from './items.actions';
import { initialItemsState } from './items.state';

export const itemsReducer = createReducer(
  initialItemsState,
  on(ItemsActions.loadItems, (state, { page, pageSize, sortField, sortOrder, searchTerm }) => ({
    ...state,
    loading: true,
    error: null,
    page: page !== undefined ? page : state.page,
    pageSize: pageSize !== undefined ? pageSize : state.pageSize,
    sortField: sortField !== undefined ? sortField : state.sortField,
    sortOrder: sortOrder !== undefined ? sortOrder : state.sortOrder,
    searchTerm: searchTerm !== undefined ? searchTerm : state.searchTerm,
  })),
  on(ItemsActions.loadItemsSuccess, (state, { response }) => ({
    ...state,
    items: response.data,
    totalItems: response.total,
    loading: false,
    error: null,
  })),
  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ItemsActions.updatePagination, (state, { page, pageSize }) => ({
    ...state,
    page,
    pageSize,
  })),
  on(ItemsActions.updateSort, (state, { sortField, sortOrder }) => ({
    ...state,
    sortField,
    sortOrder,
  })),
  on(ItemsActions.updateSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(ItemsActions.clearSearchTerm, (state) => ({
    ...state,
    searchTerm: '',
  }))
);
