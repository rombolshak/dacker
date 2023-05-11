import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiTextfieldControllerModule } from '@taiga-ui/core';

@Component({
  selector: 'monitraks-login',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiInputPasswordModule,
    TuiButtonModule,
    TuiLinkModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export default class LoginComponent {}
