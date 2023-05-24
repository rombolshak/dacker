import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { map, Observable, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { CollectionReference, DocumentReference } from '@firebase/firestore';
import { Identifiable } from '@app/services/identifiable';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private store: Firestore, private auth: Auth) {}

  getAll<T extends Identifiable>(...collectionPath: string[]): Observable<T[]> {
    const ref = collection(this.store, this.getUserSegment(), ...collectionPath) as CollectionReference<T>;
    return fromPromise(getDocs<T>(ref)).pipe(map(query => query.docs.map(doc => doc.data())));
  }

  read<T>(collectionPath: string[], itemId: string): Observable<T | null> {
    const ref = this.getItemRef<T>(collectionPath, itemId);
    return fromPromise(getDoc(ref)).pipe(map(snapshot => snapshot.data() ?? null));
  }
  update<T>(collectionPath: string[], itemId: string, data: Partial<T>): Observable<void> {
    const ref = this.getItemRef<T>(collectionPath, itemId);
    return fromPromise(setDoc(ref, data, { merge: true }));
  }

  add<T extends Identifiable>(collectionPath: string[], data: Omit<T, 'id'>): Observable<string> {
    const ref = doc(collection(this.store, this.getUserSegment(), ...collectionPath));
    const model = { ...data, id: ref.id } as T;
    return fromPromise(setDoc(ref, model)).pipe(switchMap(() => ref.id));
  }
  delete(collectionPath: string[], itemId: string): Observable<void> {
    const ref = this.getItemRef(collectionPath, itemId);
    return fromPromise(deleteDoc(ref));
  }

  private getItemRef<T>(collectionPath: string[], itemId: string): DocumentReference<T> {
    return doc(this.store, this.getUserSegment(), ...collectionPath, itemId) as DocumentReference<T>;
  }

  private getUserSegment() {
    return '/users/' + (this.auth.currentUser?.uid ?? 'none');
  }
}
