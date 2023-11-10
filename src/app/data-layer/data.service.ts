import { Injectable } from '@angular/core';
import { AccountData, accountDataConverter } from '@app/models/account.data';
import { OperationData, operationDataConverter } from '@app/models/operation.data';
import {
  DefaultEntityListRequestBuilder,
  EntityListRequestBuilder,
  EntityRequestBuilder,
} from '@app/data-layer/request.builder';
import { StorageService } from '@app/data-layer/storage.service';

export class AccountRequestBuilder extends EntityRequestBuilder<AccountData> {
  constructor(storage: StorageService, accountPath: string) {
    super(storage, accountPath, accountDataConverter);
  }

  public operations = new DefaultEntityListRequestBuilder<OperationData>(
    this.storage,
    `${this.entityPath}/operations`,
    operationDataConverter,
  );
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private storage: StorageService) {}

  public accounts = new EntityListRequestBuilder<AccountData, AccountRequestBuilder>(
    this.storage,
    'accounts',
    accountDataConverter,
    id => new AccountRequestBuilder(this.storage, `accounts/${id}`),
  );
  // public operations: OperationsRequestBuilder;
}
