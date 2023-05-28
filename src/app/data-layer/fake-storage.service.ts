import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class FakeStorageService {
  getAll<T>(collectionName: string): Observable<T[]> {
    return of([]);
  }

  get<T>(entityPath: string): Observable<T | null> {
    return of(null);
  }

  set<T>(entityPath: string, data: T): Observable<void> {
    return of();
  }

  delete(entityPath: string): Observable<void> {
    return of();
  }
}
