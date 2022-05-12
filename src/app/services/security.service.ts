import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private IsAuthorized: any;

  private authSourse = new Subject<boolean>();
  private authChallenge$  = this.authSourse.asObservable();

  constructor(private storeService: StorageService) {
    if (this.storeService.retrieve('IsAuthorized') !== '') {
      this.IsAuthorized = this.storeService.retrieve('IsAuthorized');
      this.authSourse.next(true);
    }
  }

  public GetToken(): any {
    return this.storeService.retrieve('authData');
  }

  public ResetAuthData() {
    this.storeService.store('authData', '');
    this.IsAuthorized = false;
    this.storeService.store('IsAuthorized', false);
  }

  public SetAuthData(token: any) {
    this.storeService.store('authData', token);
    this.IsAuthorized = true;
    this.storeService.store('IsAuthorized', true);

    this.authSourse.next(true);
  }

  public LogOff() {
    this.ResetAuthData();
    
    this.authSourse.next(true);
  }
}
