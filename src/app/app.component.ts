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
export class AppComponent implements OnInit {
  title = 'monitraks';

  public ngOnInit() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCh2Z6OYoIfuj8Fv7d_ndaheWXFQ1Rd3l8',
      authDomain: 'monitraks.firebaseapp.com',
      projectId: 'monitraks',
      storageBucket: 'monitraks.appspot.com',
      messagingSenderId: '148881802323',
      appId: '1:148881802323:web:7708954cf5817cef8df2a6',
      measurementId: 'G-XQZ5QEX5DQ',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  }
}
