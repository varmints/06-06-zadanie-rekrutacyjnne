import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton'; // Added SkeletonModule
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
    SkeletonModule, // Added SkeletonModule
  ],
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.css'],
})
export class ItemsTableComponent implements OnInit {
  items: Item[] = [];
  cols: Column[] = [];
  totalRecords: number = 0;
  loading: boolean = true; // Changed to true
  rows: number = 10; // Default rows per page
  searchTerm: string = '';
  skeletonRows: number[] = []; // Added for skeleton loader

  private readonly MAX_TEXT_LENGTH = 50; // Maximum characters to display in a cell

  constructor(private itemsService: ItemsService) {
    this.skeletonRows = Array(this.rows).fill(0); // Initialize skeletonRows
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
    const limit = event.rows || this.rows;
    this.skeletonRows = Array(limit).fill(0); // Update skeletonRows based on current limit
    this.items = Array(limit).fill({}); // Force skeleton rows while loading
    const sortField = (event.sortField as string) || 'id';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.itemsService
      .getItems({
        page: page + 1, // API is 1-based
        limit,
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
          this.loading = false;
          // Handle error appropriately in a real application
        },
      });
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    const lazyLoadEvent: TableLazyLoadEvent = {
      first: 0,
      rows: this.rows,
      sortField: this.getCurrentSortField(),
      sortOrder: this.getCurrentSortOrder(),
    };
    this.loadItems(lazyLoadEvent);
  }

  clearSearch(): void {
    this.searchTerm = '';
    const lazyLoadEvent: TableLazyLoadEvent = {
      first: 0,
      rows: this.rows,
      sortField: this.getCurrentSortField(),
      sortOrder: this.getCurrentSortOrder(),
    };
    this.loadItems(lazyLoadEvent);
  }

  private getCurrentSortField(): string {
    return this.cols.length > 0 ? this.cols[0].field : 'id';
  }

  private getCurrentSortOrder(): 1 | -1 | 0 | undefined {
    return 1; // Default to ascending
  }

  truncateText(text: any): string {
    if (typeof text === 'string' && text.length > this.MAX_TEXT_LENGTH) {
      return text.substring(0, this.MAX_TEXT_LENGTH) + '...';
    }
    return text;
  }

  shouldShowTooltip(text: any): boolean {
    return typeof text === 'string' && text.length > this.MAX_TEXT_LENGTH;
  }
}
