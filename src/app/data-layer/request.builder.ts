import { Observable, of } from 'rxjs';
import { Identifiable } from '@app/models/identifiable';
import { StorageService } from '@app/data-layer/storage.service';

export class EntityRequestBuilder<TEntity extends Identifiable> {
  constructor(protected storage: StorageService, protected entityPath: string) {}
  public get(): Observable<TEntity | null> {
    return this.storage.get<TEntity>(this.entityPath);
  }
  public set(data: TEntity): Observable<void> {
    return this.storage.set(this.entityPath, data);
  }
  public delete(): Observable<void> {
    return this.storage.delete(this.entityPath);
  }
}

export class EntityListRequestBuilder<
  TEntity extends Identifiable,
  TEntityRequestBuilder extends EntityRequestBuilder<TEntity>
> {
  constructor(
    protected storage: StorageService,
    protected collectionPath: string,
    private entityBuilderFactory: (id: string) => TEntityRequestBuilder
  ) {}

  public getAll(): Observable<TEntity[]> {
    return this.storage.getAll<TEntity>(this.collectionPath);
  }

  public withId(id: string): TEntityRequestBuilder {
    return this.entityBuilderFactory(id);
  }
}

export class DefaultEntityListRequestBuilder<TEntity extends Identifiable> extends EntityListRequestBuilder<
  TEntity,
  EntityRequestBuilder<TEntity>
> {
  constructor(storage: StorageService, collectionPath: string) {
    super(storage, collectionPath, id => new EntityRequestBuilder<TEntity>(storage, `${collectionPath}/${id}`));
  }
}
