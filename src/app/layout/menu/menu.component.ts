import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { AuthPanelComponent } from './auth-panel/auth-panel.component';
import { TuiArrowModule, tuiArrowOptionsProvider } from '@taiga-ui/kit';

@Component({
  selector: 'monitraks-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TuiSvgModule,
    AuthPanelComponent,
    TuiHostedDropdownModule,
    TuiArrowModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
  providers: [tuiArrowOptionsProvider({ iconLarge: 'tuiIconChevronUpLarge', iconSmall: 'tuiIconChevronUp' })],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
