import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '@app/models/account';
import { StorageService } from '@app/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private storage: StorageService) {}

  getAll(): Observable<Account[]> {
    return this.storage.getAll('accounts');
  }
}
