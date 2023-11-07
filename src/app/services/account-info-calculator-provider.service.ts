import { Injectable } from '@angular/core';
import { DataService } from '@app/data-layer/data.service';
import { AccountInfoCalculator } from '@app/services/account-info.calculator';

@Injectable({
  providedIn: 'root',
})
export class AccountInfoCalculatorProviderService {
  constructor(private readonly data: DataService) {}

  public getCalculator(accountId: string) {
    return new AccountInfoCalculator(this.data.accounts.withId(accountId));
  }
}
