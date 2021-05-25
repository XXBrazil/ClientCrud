export class Cliente {
  bairro:	string;
  cep: string;
  cidade:	string;
  complemento: string;
  cpf:	string;
  emails: Array<Email>;
  id : number;
  logradouro:	string;
  nome : string;
  telefones: Array<Telefone>;
  uf:	string;
}

export class Email {
  email: string = null;
  id:	number = null;
}

export class Telefone {
  telefone: string = null;
  id: number = null;
  tipo = TipoTelefoneEnum.SELECIONE;
}

export enum TipoTelefoneEnum {
  SELECIONE = 0,
  RESIDENCIAL = 1,
  COMERCIAL = 2,
  CELULAR = 3
}

export class Login {
  user: string;
  password: string;
}

export class User {
  user: string;
  senha: string;
  admin: boolean;
}



