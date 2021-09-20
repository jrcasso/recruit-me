import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { share } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient) { }

  private tokenGetter() {
    if (localStorage.getItem('access_token') !== null) {
      return localStorage.getItem('access_token');
    } else {
      return '';
    }
  }

  public get(endpoint: string, params?: HttpParams): Observable<any> {
    if (!environment.production) { console.log('GET @ \'' + endpoint + '\': ', params); }
    return this.http.get(
      `${environment.apiHost}:${environment.apiPort}${environment.apiSlug}/${endpoint}`, {
        params: params,
        headers: {
          'Authorization': this.tokenGetter(),
        }
      }
    ).pipe(share());
  }

  public delete(endpoint: string, params?: HttpParams): Observable<any> {
    if (!environment.production) { console.log('DELETE @ \'' + endpoint + '\': ', params); }
    return this.http.delete(
      `${environment.apiHost}:${environment.apiPort}${environment.apiSlug}/${endpoint}`, {
        params: params,
        headers: {
          'Authorization': this.tokenGetter()
        }
      }
    ).pipe(share());
  }

  public post(endpoint: string, params: any): Observable<any> {
    if (!environment.production) { console.log('POST @ \'' + endpoint + '\': ', params); }
    return this.http.post(
      `${environment.apiHost}:${environment.apiPort}${environment.apiSlug}/${endpoint}`, params, {
        headers: { Authorization: this.tokenGetter() }
      }
    ).pipe(share());
  }

  public patch(endpoint: string, params: any): Observable<any> {
    if (!environment.production) { console.log('PATCH @ \'' + endpoint + '\': ', params); }
    return this.http.patch(
      `${environment.apiHost}:${environment.apiPort}${environment.apiSlug}/${endpoint}`, params, {
        headers: { Authorization: this.tokenGetter() }
      }
    ).pipe(share());
  }

  public put(endpoint: string, params: any): Observable<any> {
    if (!environment.production) { console.log('PUT @ \'' + endpoint + '\': ', params); }
    return this.http.put(
      `${environment.apiHost}:${environment.apiPort}${environment.apiSlug}/${endpoint}`, params, {
        headers: { Authorization: this.tokenGetter() }
      }
    ).pipe(share());
  }
}
