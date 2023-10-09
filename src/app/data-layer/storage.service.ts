import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  CollectionReference,
  DocumentReference,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
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

  getAll<T>(collectionName: string): Observable<T[]> {
    const ref = collection(this.store, this.getAuthPart(), collectionName) as CollectionReference<T>;
    return new Observable(observer => {
      this.statusService.initLoading(collectionName);
      return onSnapshot(
        ref,
        snapshot => {
          observer.next(snapshot.docs.map(doc => doc.data()));
          this.statusService.finishLoading(collectionName);
        },
        error => observer.error(error),
      );
    });
  }

  get<T>(entityPath: string): Observable<T | null> {
    const ref = doc(this.store, this.getAuthPart(), entityPath) as DocumentReference<T>;
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

  set<T>(entityPath: string, data: T): Observable<void> {
    const ref = doc(this.store, this.getAuthPart(), entityPath) as DocumentReference<T>;
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
