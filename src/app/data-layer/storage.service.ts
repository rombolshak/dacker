import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDocs,
  CollectionReference,
  DocumentReference,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
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
    return fromPromise(getDocs(ref)).pipe(map(result => result.docs.map(doc => doc.data())));
  }

  get<T>(entityPath: string): Observable<T | null> {
    const ref = doc(this.store, this.getAuthPart(), entityPath) as DocumentReference<T>;
    return fromPromise(getDoc(ref)).pipe(map(result => result.data() ?? null));
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
