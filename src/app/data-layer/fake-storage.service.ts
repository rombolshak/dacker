import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class FakeStorageService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get<T>(entityPath: string): Observable<T | null> {
    return of(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set<T>(entityPath: string, data: T): Observable<void> {
    return of();
  }
}
