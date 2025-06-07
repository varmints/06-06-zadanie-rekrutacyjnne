import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-items-table-search',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
  template: `
    <div class="flex items-center gap-2">
      <p-iconfield>
        <p-inputicon styleClass="pi pi-search" />
        <input
          pInputText
          type="text"
          [(ngModel)]="searchTermValue"
          (ngModelChange)="onSearchTermChange($event)"
          placeholder="Search..."
        />
      </p-iconfield>
      <p-button icon="pi pi-times" label="Clear" (click)="onClearSearch()" severity="danger" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsTableSearchComponent {
  @Input() searchTermValue: string | null = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() clearInput = new EventEmitter<void>();

  onSearchTermChange(term: string): void {
    this.searchTermChange.emit(term);
  }

  onClearSearch(): void {
    this.searchTermValue = '';
    this.clearInput.emit();
    this.searchTermChange.emit(''); // Also emit empty search term on clear
  }
}
