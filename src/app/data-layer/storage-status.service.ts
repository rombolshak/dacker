import { Injectable } from '@angular/core';
import { distinctUntilChanged, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageStatusService {
  private _isLoading = new ReplaySubject<boolean>(1);
  private _isSaving = new ReplaySubject<boolean>(1);
  private _loadingRequests: string[] = [];
  private _savingRequests: string[] = [];

  public isLoading$ = this._isLoading.asObservable().pipe(distinctUntilChanged());
  public isSaving$ = this._isSaving.asObservable().pipe(distinctUntilChanged());

  public initLoading(request: string) {
    this._loadingRequests.push(request);
    this._isLoading.next(true);
  }

  public finishLoading(request: string) {
    this._loadingRequests = this._loadingRequests.filter(r => r !== request);
    if (this._loadingRequests.length === 0) {
      this._isLoading.next(false);
    }
  }

  public initSaving(request: string) {
    this._savingRequests.push(request);
    this._isSaving.next(true);
  }

  public finishSaving(request: string) {
    this._savingRequests = this._savingRequests.filter(r => r !== request);
    if (this._savingRequests.length === 0) {
      this._isSaving.next(false);
    }
  }
}
