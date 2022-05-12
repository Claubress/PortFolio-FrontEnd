import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

 //url: string = '../assets/data/data.json';
 
  private _refresh$ = new Subject<void>();
  private  url: string = environment.url;

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) { }

  get refresh$() {
    return this._refresh$;
  }

  getData(resource: string): Observable<any> {
    return this.http.get(this.url + resource);
  }

  upDateData(resource: string, data: any): Observable<any> {
    const httpHeaders: HttpHeaders =  this.getHeaders();
    return this.http.put(this.url + resource, data, {
      headers: httpHeaders
    })
     .pipe(
        tap(() => {
            this._refresh$.next();
        })
      );
  }

  createData(resource: string, data: any): Observable<any> {
    const httpHeaders: HttpHeaders =  this.getHeaders();
    return this.http.post(this.url + resource, data, {
      headers: httpHeaders
    });
  }

  deleteData(resource: string): Observable<any> {
    const httpHeaders: HttpHeaders =  this.getHeaders();
    return this.http.delete(this.url + resource, {
      headers: httpHeaders
    });
  }

  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();

    const token = this.authService.getAuth();
    if (token) {
       httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return httpHeaders;
  }

}
