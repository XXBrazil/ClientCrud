import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService, HttpServiceResponse} from './http.service';
import {Login, User} from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpService {

  /**
   * Efetua o login
   */
  process(login: Login): Observable<HttpServiceResponse<User>> {
    return this.post(
      'login/process', login
    );
  }
}
