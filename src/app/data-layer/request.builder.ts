import { Observable } from 'rxjs';
import { Identifiable } from '@app/models/identifiable';
import { StorageService } from '@app/data-layer/storage.service';
import { FirestoreDataConverter } from '@angular/fire/firestore';

export interface IEntityRequestBuilder<TEntity extends Identifiable> {
  get(): Observable<TEntity | null>;
  set(data: TEntity): Observable<void>;
  delete(): Observable<void>;
}

export interface IEntityListRequestBuilder<
  TEntity extends Identifiable,
  TEntityRequestBuilder extends IEntityRequestBuilder<TEntity>,
> {
  getAll(): Observable<TEntity[]>;
  withId(id: string): TEntityRequestBuilder;
}

export class EntityRequestBuilder<TEntity extends Identifiable> implements IEntityRequestBuilder<TEntity> {
  constructor(
    protected readonly storage: StorageService,
    protected readonly entityPath: string,
    protected readonly converter: FirestoreDataConverter<TEntity>,
  ) {}
  public get(): Observable<TEntity | null> {
    return this.storage.get<TEntity>(this.entityPath, this.converter);
  }
  public set(data: TEntity): Observable<void> {
    return this.storage.set(this.entityPath, data, this.converter);
  }
  public delete(): Observable<void> {
    return this.storage.delete(this.entityPath);
  }
}

export class EntityListRequestBuilder<
  TEntity extends Identifiable,
  TEntityRequestBuilder extends IEntityRequestBuilder<TEntity>,
> implements IEntityListRequestBuilder<TEntity, TEntityRequestBuilder>
{
  constructor(
    protected readonly storage: StorageService,
    protected readonly collectionPath: string,
    protected readonly converter: FirestoreDataConverter<TEntity>,
    protected readonly sortField: keyof TEntity,
    private entityBuilderFactory: (id: string) => TEntityRequestBuilder,
  ) {}

  public getAll(): Observable<TEntity[]> {
    return this.storage.getAll<TEntity>(this.collectionPath, this.converter, this.sortField);
  }

  public withId(id: string): TEntityRequestBuilder {
    return this.entityBuilderFactory(id);
  }
}

export class DefaultEntityListRequestBuilder<TEntity extends Identifiable> extends EntityListRequestBuilder<
  TEntity,
  EntityRequestBuilder<TEntity>
> {
  constructor(
    storage: StorageService,
    collectionPath: string,
    converter: FirestoreDataConverter<TEntity>,
    sortField: keyof TEntity,
  ) {
    super(
      storage,
      collectionPath,
      converter,
      sortField,
      id => new EntityRequestBuilder<TEntity>(storage, `${collectionPath}/${id}`, converter),
    );
  }
}
