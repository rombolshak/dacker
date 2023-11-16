import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  FirestoreDataConverter,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { StorageStatusService } from '@app/data-layer/storage-status.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(
    private auth: Auth,
    private store: Firestore,
    private statusService: StorageStatusService,
  ) {}

  getAll<T>(collectionName: string, converter: FirestoreDataConverter<T>, sortField: keyof T): Observable<T[]> {
    const ref = collection(this.store, this.getAuthPart(), collectionName).withConverter(converter);
    const q = query(ref, orderBy(sortField as string));
    return new Observable(observer => {
      this.statusService.initLoading(collectionName);
      return onSnapshot(
        q,
        snapshot => {
          observer.next(snapshot.docs.map(doc => doc.data()));
          this.statusService.finishLoading(collectionName);
        },
        error => observer.error(error),
      );
    });
  }

  get<T>(entityPath: string, converter: FirestoreDataConverter<T>): Observable<T | null> {
    const ref = doc(this.store, this.getAuthPart(), entityPath).withConverter(converter);
    return new Observable(observer => {
      this.statusService.initLoading(entityPath);
      return onSnapshot(
        ref,
        snapshot => {
          observer.next(snapshot.data());
          this.statusService.finishLoading(entityPath);
        },
        error => observer.error(error),
      );
    });
  }

  set<T>(entityPath: string, data: T, converter: FirestoreDataConverter<T>): Observable<void> {
    const ref = doc(this.store, this.getAuthPart(), entityPath).withConverter(converter);
    this.statusService.initSaving(entityPath);
    return fromPromise(setDoc(ref, data)).pipe(tap(() => this.statusService.finishSaving(entityPath)));
  }

  delete(entityPath: string): Observable<void> {
    const ref = doc(this.store, this.getAuthPart(), entityPath);
    this.statusService.initSaving(entityPath);
    return fromPromise(deleteDoc(ref)).pipe(tap(() => this.statusService.finishSaving(entityPath)));
  }

  private getAuthPart(): string {
    return '/users/' + (this.auth.currentUser?.uid ?? 'anon');
  }
}
