import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FakeStorageService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get<T>(entityPath: string): Observable<T | null> {
    return of(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAll<T>(collectionName: string): Observable<T[]> {
    return of([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set<T>(entityPath: string, data: T): Observable<void> {
    return of();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(entityPath: string): Observable<void> {
    return of();
  }
}
