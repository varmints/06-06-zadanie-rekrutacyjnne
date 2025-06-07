import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent, Table } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Item } from '../../models/item.model';
import { Subject, Observable } from 'rxjs'; // Removed unused Subscription
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { ItemsState } from '../../store/items/items.state';
import * as ItemsActions from '../../store/items/items.actions';
import * as ItemsSelectors from '../../store/items/items.selectors';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-items-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.css'],
})
export class ItemsTableComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;

  items$: Observable<Item[]>;
  totalRecords$: Observable<number>;
  loading$: Observable<boolean>;
  searchTerm$: Observable<string>;

  cols: Column[] = [];
  rows: number = 10;

  private readonly MAX_TEXT_LENGTH = 20;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private readonly LOCAL_STORAGE_ROWS_KEY = 'itemsTableRowsPerPage';
  skeletonRows: any[] = [];

  constructor(private store: Store<{ items: ItemsState }>) {
    this.items$ = this.store.pipe(select(ItemsSelectors.selectAllItems));
    this.totalRecords$ = this.store.pipe(select(ItemsSelectors.selectTotalItems));
    this.loading$ = this.store.pipe(select(ItemsSelectors.selectLoading));
    this.searchTerm$ = this.store.pipe(select(ItemsSelectors.selectSearchTerm));
  }

  ngOnInit(): void {
    const storedRows = localStorage.getItem(this.LOCAL_STORAGE_ROWS_KEY);
    if (storedRows) {
      const parsedRows = parseInt(storedRows, 10);
      if (!isNaN(parsedRows) && parsedRows > 0) {
        this.rows = parsedRows;
        this.store.dispatch(ItemsActions.updatePagination({ page: 0, pageSize: this.rows }));
      }
    }

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'date', header: 'Date' },
    ];

    this.skeletonRows = Array(this.rows).fill({});

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((term) => {
      this.store.dispatch(ItemsActions.updateSearchTerm({ searchTerm: term }));
    });

    this.store.pipe(select(ItemsSelectors.selectPagination), takeUntil(this.destroy$)).subscribe((pagination) => {
      if (pagination && pagination.pageSize !== this.rows) {
        this.rows = pagination.pageSize;
        this.skeletonRows = Array(this.rows).fill({});
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItems(event: TableLazyLoadEvent): void {
    const eventRows = event.rows ?? this.rows;
    const page = event.first !== undefined && eventRows > 0 ? event.first / eventRows : 0;
    const pageSize = eventRows;
    const sortField = (event.sortField as string) || this.getCurrentSortField();
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.store.dispatch(ItemsActions.updatePagination({ page, pageSize }));
    this.store.dispatch(ItemsActions.updateSort({ sortField, sortOrder }));
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const term = inputElement.value;
    this.searchSubject.next(term);
  }

  clearSearch(): void {
    this.searchSubject.next('');
  }

  private getCurrentSortField(): string {
    return this.cols.length > 0 ? this.cols[0].field : 'id';
  }

  truncateText(text: string | number | null | undefined): string {
    const textAsString = String(text ?? '');
    if (textAsString.length > this.MAX_TEXT_LENGTH) {
      return textAsString.substring(0, this.MAX_TEXT_LENGTH) + '...';
    }
    return textAsString;
  }

  shouldShowTooltip(text: string | number | null | undefined): boolean {
    const textAsString = String(text ?? '');
    return textAsString.length > this.MAX_TEXT_LENGTH;
  }
}
