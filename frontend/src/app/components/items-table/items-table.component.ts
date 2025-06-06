import { Component, OnInit, ViewChild } from '@angular/core'; // Added ViewChild
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
export class ItemsTableComponent implements OnInit {
  @ViewChild('dt') dt!: Table; // Added ViewChild reference to the table

  items: Item[] = [];
  cols: Column[] = [];
  totalRecords: number = 0;
  loading: boolean = true; // Changed to true
  rows: number = 10; // Default rows per page
  searchTerm: string = '';

  private readonly MAX_TEXT_LENGTH = 20; // Maximum characters to display in a cell

  constructor(
    private itemsService: ItemsService,
    private messageService: MessageService // Injected MessageService
  ) {
    this.items = Array(this.rows).fill({}); // Force skeleton rows on first load
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'date', header: 'Date' },
    ];
    // Initial load: trigger skeleton and data fetch
    this.loadItems({
      first: 0,
      rows: this.rows,
      sortField: this.getCurrentSortField(),
      sortOrder: this.getCurrentSortOrder(),
    });
  }

  loadItems(event: TableLazyLoadEvent): void {
    this.loading = true;
    const page = event.first !== undefined && event.rows ? event.first / event.rows : 0;
    const pageSize = event.rows || this.rows;
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
    const lazyLoadEvent: TableLazyLoadEvent = {
      first: 0, // Reset to first page
      rows: this.dt ? this.dt.rows : this.rows,
      sortField: this.dt && this.dt.sortField ? this.dt.sortField : this.getCurrentSortField(),
      sortOrder: this.dt && this.dt.sortOrder ? this.dt.sortOrder : this.getCurrentSortOrder(),
    };
    this.loadItems(lazyLoadEvent);
  }

  clearSearch(): void {
    this.searchTerm = '';
    const lazyLoadEvent: TableLazyLoadEvent = {
      first: 0, // Reset to first page
      rows: this.dt ? this.dt.rows : this.rows,
      sortField: this.dt && this.dt.sortField ? this.dt.sortField : this.getCurrentSortField(),
      sortOrder: this.dt && this.dt.sortOrder ? this.dt.sortOrder : this.getCurrentSortOrder(),
    };
    this.loadItems(lazyLoadEvent);
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
