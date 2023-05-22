import { Injectable } from '@angular/core';
import { AccountData } from '@app/model/account.data';
import { OperationData } from '@app/model/operation.data';
import {
  DefaultEntityListRequestBuilder,
  EntityListRequestBuilder,
  EntityRequestBuilder,
} from '@app/data-layer/request.builder';
import { StorageService } from '@app/data-layer/storage.service';

class AccountRequestBuilder extends EntityRequestBuilder<AccountData> {
  constructor(storage: StorageService, accountPath: string) {
    super(storage, accountPath);
  }

  public operations = new DefaultEntityListRequestBuilder<OperationData>(this.storage, `${this.entityPath}/operations`);
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private storage: StorageService) {}

  public accounts = new EntityListRequestBuilder<AccountData, AccountRequestBuilder>(
    this.storage,
    'accounts',
    id => new AccountRequestBuilder(this.storage, id)
  );
  // public operations: OperationsRequestBuilder;
}
