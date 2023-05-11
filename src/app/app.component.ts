import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './layout/menu/menu.component';
import { TuiRootModule } from '@taiga-ui/core';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, TuiRootModule],
  selector: 'monitraks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'monitraks';
}
