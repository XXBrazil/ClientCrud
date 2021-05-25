import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Cliente, Email, Login, Telefone, TipoTelefoneEnum, User} from '../../models/cliente.model';
import {LoginService} from '../../services/login.service';
import {HttpServiceResponse} from '../../services/http.service';
import {ClienteService} from '../../services/cliente.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
  constructor(public loginService: LoginService,
              public clienteService: ClienteService,
              public notificationService: NotificationService,
              private fb: FormBuilder,) {
  }
  status: boolean;
  formPesquisar: FormGroup;
  formLogin: FormGroup;
  formCadastro: FormGroup;
  user$ : Observable<HttpServiceResponse<User>>;
  cliente$ : Observable<HttpServiceResponse<Cliente>>;
  tiposTelefone = [
    {id: TipoTelefoneEnum.SELECIONE, name:'SELECIONE' },
    {id: TipoTelefoneEnum.CELULAR, name:'CELULAR' },
    {id: TipoTelefoneEnum.COMERCIAL, name: 'COMERCIAL' },
    {id: TipoTelefoneEnum.RESIDENCIAL, name: 'RESIDENCIAL' },
    ];
  ngOnInit() {
    this.buildLoginForm();
    this.buildCadastroForm();
    this.buildPesquisaForm();
  }

  buildPesquisaForm() {
    this.formPesquisar = this.fb.group({
      cpf: [ null, Validators.required],
    }, );
  }

  buildLoginForm() {
    this.formLogin = this.fb.group({
      user: [ null, Validators.required],
      password: [null, Validators.required],
    }, );
  }

  buildCadastroForm() {
    const telefones = [];
    const emails = [];

    this.formCadastro = this.fb.group({
      nome: [ null, [Validators.required, Validators.minLength(3) ,Validators.maxLength(100)]],
      cpf: [null, Validators.required],
      cep: [null, Validators.required],
      logradouro: [null, Validators.required],
      bairro: [null, Validators.required],
      cidade: [null, Validators.required],
      uf: [null, Validators.required],
      complemento: [null],
      emails: this.fb.array( emails.length? [] : [this.createEmail()]),
      telefones: this.fb.array(telefones.length? [] : [this.createTelefone()]),
    }, );
    // telefones.map(i=>this.createTelefone(i)).forEach(i=>this.addTelefone(i));
    this.formCadastro.get('emails').setValidators(Validators.required);
    this.formCadastro.get('telefones').setValidators(Validators.required);
  }

  cadastrar() {
    this.cliente$ = this.clienteService.cadastrarCliente(this.formCadastro.getRawValue() as Cliente);
    this.cliente$.subscribe( cliente => {
      this.validarCliente(cliente);
    })
  }

  popularForm(cliente: any){
    this.formCadastro.get('nome').setValue(cliente.nome);
    this.formCadastro.get('cpf').setValue(cliente.cpf);
    this.formCadastro.get('cep').setValue(cliente.cep);
    this.formCadastro.get('logradouro').setValue(cliente.logradouro);
    this.formCadastro.get('bairro').setValue(cliente.bairro);
    this.formCadastro.get('cidade').setValue(cliente.cidade);
    this.formCadastro.get('uf').setValue(cliente.uf);
    this.formCadastro.get('complemento').setValue(cliente.complemento);
    this.formCadastro.get('telefones').setValue(cliente.telefones);
    this.formCadastro.get('emails').setValue(cliente.emails);
  }

  pesquisar() {
    this.cliente$ = this.clienteService.listarClientePorCpf(this.formPesquisar.getRawValue().cpf);
    this.cliente$.subscribe( cliente => {
      this.popularForm(cliente);
    })
  }

  add() {
    this.addEmail();
    this.addTelefone();
  }

  createEmail(): FormGroup {
    return this.fb.group(new Email());
  }

  createTelefone(telefone?:Telefone): FormGroup {
    return this.fb.group(telefone ? telefone: new Telefone());
  }

  addEmail() {
    this.emails.push(this.createEmail());
  }

  addTelefone(telefone?:FormGroup) {
    this.telefones.push(telefone? telefone: this.createTelefone());
  }

  deleteEmail(index: number) {
    this.emails.removeAt(index);
  }

  deleteTelefone(index: number) {
    this.telefones.removeAt(index);
  }

  get emails() {
    return this.formCadastro.controls['emails'] as FormArray;
  }

  get telefones() {
    return this.formCadastro.controls['telefones'] as FormArray;
  }

  login(){
    this.user$ = this.loginService.process(this.formLogin.getRawValue() as Login);
    this.user$.subscribe( user => {
      this.validarUser(user);
    })
  }

  validarUser(user: any) {
    if (!user.user) {
      this.notificationService.showNotification('top', 'left', 3);
    } else {
      this.notificationService.fecharMensagem();
    }
  }

  validarCliente(cliente: any) {
    if (!cliente.id) {
      this.notificationService.showNotification('top', 'left', 4);
    } else {
      this.notificationService.showNotification('top', 'left', 2);
      this.formCadastro.reset();
    }
  }

  buscarCep() {
   this.clienteService.buscarCep(this.formCadastro.get('cep').value).subscribe( cliente => {
     if (cliente) {
       this.formCadastro.patchValue(cliente);
       this.formCadastro.get('cidade').setValue(cliente.localidade);
     }
   });
  }

  validarCPF() {
    let cpf = this.formCadastro.get('cpf').value;
    const cpfValido = /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))$/;
    if (cpfValido.test(cpf) === false)    {
      cpf = cpf.replace( /\D/g , ''); // Remove tudo o que não é dígito
      if (cpf.length === 11){
        cpf = cpf.replace( /(\d{3})(\d)/ , '$1.$2'); // Coloca um ponto entre o terceiro e o quarto dígitos
        cpf = cpf.replace( /(\d{3})(\d)/ , '$1.$2'); // Coloca um ponto entre o terceiro e o quarto dígitos
        // de novo (para o segundo bloco de números)
        cpf = cpf.replace( /(\d{3})(\d{1,2})$/ , '$1-$2'); // Coloca um hífen entre o terceiro e o quarto dígitos
        this.formCadastro.get('cpf').setValue(cpf);
      }else{
        this.formCadastro.get('cpf').setValue('CPF invalido!');
        setTimeout( () => this.formCadastro.get('cpf').reset(), 1600 );
      }
    }
  }


}
