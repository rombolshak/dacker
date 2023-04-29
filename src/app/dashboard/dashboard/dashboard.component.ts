import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dacker-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export default class DashboardComponent {}
