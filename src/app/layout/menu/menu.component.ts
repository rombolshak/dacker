import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'dacker-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TuiSvgModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent {
  menuItems = [
    {
      link: 'dashboard',
      name: 'Вклады',
      icon: 'tuiIconBriefcaseLarge',
    },
    {
      link: 'register',
      name: 'Операции',
      icon: 'tuiIconListLarge',
    },
    {
      link: 'income',
      name: 'Начисления',
      icon: 'tuiIconDollarSignLarge',
    },
    {
      link: 'reports',
      name: 'Отчеты',
      icon: 'tuiIconPieChartLarge',
    },
  ];
}
