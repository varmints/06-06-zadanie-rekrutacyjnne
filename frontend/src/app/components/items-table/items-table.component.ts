import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'; // Added OnDestroy
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent, Table } from 'primeng/table'; // Added Table
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Item } from '../../models/item.model';
import { ItemsService } from '../../services/items.service';
import { GetItemsResponse } from '../../models/get-items-response.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  // Implemented OnDestroy
  @ViewChild('dt') dt!: Table; // Added ViewChild reference to the table

  items: Item[] = [];
  cols: Column[] = [];
  totalRecords: number = 0;
  loading: boolean = true; // Changed to true
  rows: number = 10; // Default rows per page
  searchTerm: string = '';

  private readonly MAX_TEXT_LENGTH = 20; // Maximum characters to display in a cell
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private readonly LOCAL_STORAGE_ROWS_KEY = 'itemsTableRowsPerPage'; // Added for local storage

  constructor(
    private itemsService: ItemsService,
    private messageService: MessageService // Injected MessageService
  ) {
    this.items = Array(this.rows).fill({}); // Force skeleton rows on first load
  }

  ngOnInit(): void {
    const storedRows = localStorage.getItem(this.LOCAL_STORAGE_ROWS_KEY);
    if (storedRows) {
      const parsedRows = parseInt(storedRows, 10);
      if (!isNaN(parsedRows) && parsedRows > 0) {
        this.rows = parsedRows;
      }
    }

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'date', header: 'Date' },
    ];
    this.loadItems({
      first: 0,
      rows: this.rows, // Use the initialized this.rows
      sortField: this.getCurrentSortField(),
      sortOrder: this.getCurrentSortOrder(),
    });

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(500)) // Debounce for 500ms
      .subscribe(() => {
        const lazyLoadEvent: TableLazyLoadEvent = {
          first: 0, // Reset to first page
          rows: this.dt ? this.dt.rows : this.rows,
          sortField: this.dt?.sortField ?? this.getCurrentSortField(),
          sortOrder: this.dt?.sortOrder ?? this.getCurrentSortOrder(),
        };
        this.loadItems(lazyLoadEvent);
      });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadItems(event: TableLazyLoadEvent): void {
    this.loading = true;

    // If event.rows is provided (e.g., from paginator change),
    // update this.rows and save to localStorage.
    if (typeof event.rows === 'number' && event.rows > 0) {
      this.rows = event.rows;
      localStorage.setItem(this.LOCAL_STORAGE_ROWS_KEY, this.rows.toString());
    }
    // this.rows now holds the correct value (from event, or from previous state/localStorage)

    const page = event.first !== undefined && this.rows > 0 ? event.first / this.rows : 0;
    const pageSize = this.rows; // pageSize is now consistently this.rows

    this.items = Array(pageSize).fill({}); // Force skeleton rows while loading
    const sortField = (event.sortField as string) || 'id';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.itemsService
      .getItems({
        page: page + 1, // API is 1-based
        pageSize,
        sortField,
        sortOrder,
        search: this.searchTerm,
      })
      .subscribe({
        next: (response: GetItemsResponse) => {
          this.items = response.data;
          this.totalRecords = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching items:', error);
          this.items = []; // Clear items on error
          this.totalRecords = 0;
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error Loading Data',
            detail: 'Could not load items. Please try again later.',
            life: 3000,
          });
        },
      });
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.searchSubject.next(this.searchTerm); // Use subject to trigger search
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next(''); // Trigger debounced search with empty term
  }

  private getCurrentSortField(): string {
    return this.cols.length > 0 ? this.cols[0].field : 'id';
  }

  private getCurrentSortOrder(): 1 | -1 | 0 | undefined {
    return 1; // Default to ascending
  }

  truncateText(text: string | number | null | undefined): string {
    const textAsString = String(text ?? ''); // Convert to string, handling null/undefined
    if (textAsString.length > this.MAX_TEXT_LENGTH) {
      return textAsString.substring(0, this.MAX_TEXT_LENGTH) + '...';
    }
    return textAsString;
  }

  shouldShowTooltip(text: string | number | null | undefined): boolean {
    const textAsString = String(text ?? ''); // Convert to string, handling null/undefined
    return textAsString.length > this.MAX_TEXT_LENGTH;
  }
}
