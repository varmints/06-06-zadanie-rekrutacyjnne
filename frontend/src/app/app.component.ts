import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ItemsTableComponent } from './components/items-table/items-table.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, ItemsTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'frontend';
}
