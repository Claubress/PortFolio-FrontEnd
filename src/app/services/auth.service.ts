import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PortfolioService } from './portfolio.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private  url: string = environment.url;
  
  private resource: string = 'auth/login';

  private changeLoginSourse = new Subject<void>();
  public changeLogin$ = this.changeLoginSourse.asObservable();

  constructor(
    private http: HttpClient,
    private storeService: StorageService    
  ) { }

  login(userLogin: any): Observable<any> {
    this.removeAuth();
    return this.http.post(this.url + this.resource, userLogin);
  }

  setAuth(token: string): void {
    this.storeService.store('token', token);
    this.changeLoginSourse.next();
  }

  getAuth(): any {
    return this.storeService.retrieve('token');
  }

  removeAuth(): void {
    this.storeService.remove('token');
    this.changeLoginSourse.next();
  }

  getUserLoged(): boolean {
    return this.getAuth() ? true : false;
  }

}
