import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './layout/menu/menu.component';
import { TuiRootModule } from '@taiga-ui/core';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, TuiRootModule],
  selector: 'dacker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'dacker';

  public ngOnInit() {
    const firebaseConfig = {
      apiKey: "AIzaSyDQaCfBRjlZh1BPpJNuQORrUA8VRbP4AGA",
      authDomain: "bububudget.firebaseapp.com",
      projectId: "bububudget",
      storageBucket: "bububudget.appspot.com",
      messagingSenderId: "143725096957",
      appId: "1:143725096957:web:4c461cee6172b95e10b394",
      measurementId: "G-6S9NTNHK18"
    };

// Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  }
}
