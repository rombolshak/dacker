import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dacker-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent {
  menuItems = [
    {
      link: 'dashboard',
      name: 'Вклады',
    },
    {
      link: 'register',
      name: 'Операции',
    },
    {
      link: 'reports',
      name: 'Отчеты',
    },
  ];
}
