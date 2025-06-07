import { createAction, props } from '@ngrx/store';
import { GetItemsResponse } from '../../models/get-items-response.model';

export const loadItems = createAction(
  '[Items Table] Load Items',
  props<{
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    searchTerm?: string;
  }>()
);

export const loadItemsSuccess = createAction('[Items API] Load Items Success', props<{ response: GetItemsResponse }>());

export const loadItemsFailure = createAction('[Items API] Load Items Failure', props<{ error: any }>());

export const updatePagination = createAction(
  '[Items Table] Update Pagination',
  props<{ page: number; pageSize: number }>()
);

export const updateSort = createAction(
  '[Items Table] Update Sort',
  props<{ sortField: string; sortOrder: 'asc' | 'desc' }>()
);

export const updateSearchTerm = createAction('[Items Table] Update Search Term', props<{ searchTerm: string }>());

export const clearSearchTerm = createAction('[Items Table] Clear Search Term');
