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
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(
    private auth: Auth,
    private store: Firestore,
  ) {}

  getAll<T>(collectionName: string): Observable<T[]> {
    const ref = collection(this.store, this.getAuthPart(), collectionName) as CollectionReference<T>;
    return new Observable(observer => {
      return onSnapshot(
        ref,
        snapshot => {
          observer.next(snapshot.docs.map(doc => doc.data()));
        },
        error => observer.error(error),
      );
    });
  }

  get<T>(entityPath: string): Observable<T | null> {
    const ref = doc(this.store, this.getAuthPart(), entityPath) as DocumentReference<T>;
    return new Observable(observer => {
      return onSnapshot(
        ref,
        snapshot => {
          observer.next(snapshot.data());
        },
        error => observer.error(error),
      );
    });
  }

  set<T>(entityPath: string, data: T): Observable<void> {
    const ref = doc(this.store, this.getAuthPart(), entityPath) as DocumentReference<T>;
    return fromPromise(setDoc(ref, data));
  }

  delete(entityPath: string): Observable<void> {
    const ref = doc(this.store, this.getAuthPart(), entityPath);
    return fromPromise(deleteDoc(ref));
  }

  private getAuthPart(): string {
    return '/users/' + (this.auth.currentUser?.uid ?? 'anon');
  }
}
