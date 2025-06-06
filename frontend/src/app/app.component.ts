import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ItemsTableComponent } from './components/items-table/items-table.component';
import { MenuModule } from 'primeng/menu'; // Import MenuModule
import { MenuItem } from 'primeng/api'; // Import MenuItem

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    ItemsTableComponent,
    MenuModule, // Add MenuModule to imports
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'frontend';
  menuItems: MenuItem[];

  constructor() {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
      { label: 'Items', icon: 'pi pi-fw pi-list', routerLink: ['/'] }, // Assuming items table is the main view
      { label: 'Settings', icon: 'pi pi-fw pi-cog' },
      // Add more menu items as needed
    ];
  }
}
