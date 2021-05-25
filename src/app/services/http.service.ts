import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http: HttpClient) {
  }

  private static getHeader(): { headers: HttpHeaders } {
    const headerDict = {
      'Content-Type': 'application/json'
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return requestOptions;
  }

  get(url: string): Observable<any> {
      return this.http.get<any>(`${environment.SERVICE}/${url}`, HttpService.getHeader());
  }

  post(url: string, object: any): Observable<any> {
    return this.http.post<any>(`${environment.SERVICE}/${url}`, object, HttpService.getHeader());
  }

  cep(cep: string): Observable<any> {
    return this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`, HttpService.getHeader());
  }

}

export interface HttpServiceResponse<T> {
  resultado: T;
}
