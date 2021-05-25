import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService, HttpServiceResponse} from './http.service';
import {Cliente} from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends HttpService {

  /**
   * Obtem cliente por Id
   */
  listarClientePorId(id: number): Observable<HttpServiceResponse<Cliente>> {
    return this.get(
      'clients/'+id,
    );
  }

  /**
   * Efetua cadastro do cliente
   */
  cadastrarCliente(cliente: Cliente): Observable<HttpServiceResponse<Cliente>> {
    return this.post(
      'clients/'+ cliente.id, cliente
    );
  }
}
