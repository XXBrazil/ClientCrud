import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService, HttpServiceResponse} from './http.service';
import {Cliente} from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends HttpService {

  /**
   * Obtem cliente por Cpf
   */
  listarClientePorCpf(cpf: string): Observable<HttpServiceResponse<Cliente>> {
    return this.get(
      'clients/'+cpf+'/cpf',
    );
  }

  /**
   * Efetua cadastro do cliente
   */
  cadastrarCliente(cliente: Cliente): Observable<HttpServiceResponse<Cliente>> {
    return this.post(
      'clients/', cliente
    );
  }

  /**
   * Obtem cep em servoço externo
   * Saiba mais:https://viacep.com.br/
   */
  buscarCep(cep: string): any {
    return this.cep(cep);
  }
}
