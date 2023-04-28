import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './layout/menu/menu.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent],
  selector: 'dacker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'dacker';
}
