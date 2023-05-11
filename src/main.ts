import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import {TUI_SANITIZER} from "@taiga-ui/core";
import {NgDompurifySanitizer} from "@tinkoff/ng-dompurify";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimations(), {
    provide: TUI_SANITIZER,
    useClass: NgDompurifySanitizer
  }],
}).catch(err => console.error(err));
