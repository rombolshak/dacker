import { Injectable } from '@angular/core';
import { BankInfo } from './bank-info';
import { banks } from './bank-list';

@Injectable({
  providedIn: 'root',
})
export class BankInfoService {
  public getAllBanks(): BankInfo[] {
    return banks;
  }

  public findById(id: string): BankInfo | null {
    return banks.find(b => b.id === id) ?? null;
  }
}
