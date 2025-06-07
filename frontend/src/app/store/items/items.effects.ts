import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom, tap, filter } from 'rxjs/operators';
import { ItemsService } from '../../services/items.service';
import * as ItemsActions from './items.actions';
import * as ItemsSelectors from './items.selectors';
import { ItemsState, initialItemsState } from './items.state';

@Injectable()
export class ItemsEffects {
  private readonly LOCAL_STORAGE_ROWS_KEY = 'itemsTableRowsPerPage';

  // Declare effects properties
  loadItems$: Observable<Action>;
  triggerLoadOnParamChange$: Observable<Action>;
  savePageSizeToLocalStorage$: Observable<Action>;

  constructor(
    private actions$: Actions,
    private itemsService: ItemsService,
    private store: Store<{ items: ItemsState }>
  ) {
    console.log('[ItemsEffects Constructor] Entered. actions$:', this.actions$);

    // Initialize effects within the constructor body
    this.loadItems$ = createEffect(() => {
      if (!this.actions$) {
        console.error('[ItemsEffects loadItems$] actions$ is undefined.');
        return of(ItemsActions.loadItemsFailure({ error: 'actions$ undefined' }));
      }
      return this.actions$.pipe(
        ofType(ItemsActions.loadItems),
        withLatestFrom(
          this.store.pipe(select(ItemsSelectors.selectPagination)),
          this.store.pipe(select(ItemsSelectors.selectSort)),
          this.store.pipe(select(ItemsSelectors.selectSearchTerm))
        ),
        switchMap(([action, pagination, sort, searchTerm]) => {
          const page = action.page !== undefined ? action.page : pagination.page;
          const pageSize = action.pageSize !== undefined ? action.pageSize : pagination.pageSize;
          const sortField = action.sortField !== undefined ? action.sortField : sort.sortField;
          const sortOrder = action.sortOrder !== undefined ? action.sortOrder : sort.sortOrder;
          const currentSearchTerm = action.searchTerm !== undefined ? action.searchTerm : searchTerm;
          const finalPageSize = pageSize > 0 ? pageSize : initialItemsState.pageSize;
          return this.itemsService
            .getItems({
              page: page + 1, // API is 1-based
              pageSize: finalPageSize,
              sortField: sortField || initialItemsState.sortField,
              sortOrder: sortOrder || initialItemsState.sortOrder,
              search: currentSearchTerm,
            })
            .pipe(
              map((response) => ItemsActions.loadItemsSuccess({ response })),
              catchError((error) => of(ItemsActions.loadItemsFailure({ error })))
            );
        })
      );
    });

    this.triggerLoadOnParamChange$ = createEffect(() => {
      if (!this.actions$) {
        console.error('[ItemsEffects triggerLoadOnParamChange$] actions$ is undefined.');
        return of(ItemsActions.loadItemsFailure({ error: 'actions$ undefined' }));
      }
      return this.actions$.pipe(
        ofType(
          ItemsActions.updatePagination,
          ItemsActions.updateSort,
          ItemsActions.updateSearchTerm,
          ItemsActions.clearSearchTerm
        ),
        map(() => ItemsActions.loadItems({}))
      );
    });

    this.savePageSizeToLocalStorage$ = createEffect(
      () => {
        if (!this.actions$) {
          console.error('[ItemsEffects savePageSizeToLocalStorage$] actions$ is undefined.');
          return EMPTY;
        }
        return this.actions$.pipe(
          ofType(ItemsActions.updatePagination),
          filter((action) => action.pageSize !== undefined && action.pageSize > 0),
          tap((action) => {
            if (action.pageSize) {
              localStorage.setItem(this.LOCAL_STORAGE_ROWS_KEY, action.pageSize.toString());
            }
          })
        );
      },
      { dispatch: false }
    );
    console.log('[ItemsEffects Constructor] All effects initialized.');
  }
}
