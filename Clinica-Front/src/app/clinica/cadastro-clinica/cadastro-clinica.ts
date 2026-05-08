import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { NgxMaskDirective , provideNgxMask } from 'ngx-mask';

import { ActivatedRoute, Router } from '@angular/router';

import { ClinicaService } from '../../services/clinicaapi.service';
import { Clinica } from '../../models/clinica.models';
import { BrasilapiService } from '../../services/brasilapi.service';
import { Estado, Municipio } from '../../models/brasilapi.models';

@Component({
  selector: 'app-cadastro-clinica',
  standalone: true,
  imports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    NgxMaskDirective
  ], providers: [
    provideNgxMask()
  ],
  templateUrl: './cadastro-clinica.html',
  styleUrl: './cadastro-clinica.scss'
})
export class CadastroClinicaComponent implements OnInit {

  clinica: Clinica = {
    id: 0,
    nome: '',
    telefone: '',
    endereco: '',
    numero: null,
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: '',
    cep: ''
  };
  
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private service: ClinicaService,
    private brasilApiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarEstados();

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');

      if (!id) return;

      this.atualizando = true;

      this.service.buscarClinicaPorId(Number(id)).subscribe({
        next: (clinicaEncontrada) => {
          this.clinica = { ...clinicaEncontrada };
          setTimeout(() => {
            this.clinica.telefone = this.clinica.telefone;
            this.cdr.detectChanges();
          });

          if (this.clinica.estado) {
            this.brasilApiService.listarMunicipios(this.clinica.estado).subscribe({
              next: (lista) => {
                this.municipios = lista;
                this.cdr.detectChanges();
              }
            });
          }
        }
      });
    });
  }

  carregarEstados() {
    this.brasilApiService.listarEstados().subscribe({
      next: lista => this.estados = lista
    });
  }

  carregarMunicipios(uf: string) {
    this.municipios = [];

    return this.brasilApiService.listarMunicipios(uf).subscribe({
      next: lista => this.municipios = lista,
      error: err => console.log(err)
    });
  }  

  salvar() {

  if (!this.atualizando) {
    this.service.salvar(this.clinica).subscribe({
      next: () => {
        this.mostrarMensagem('Salvo com sucesso!');
        this.router.navigate(['/lista-clinica']);
      },
      error: (err) => {
        console.log(err);
        this.mostrarMensagem('Erro ao salvar!');
      }
    });
  } else {
    this.service.atualizar(this.clinica).subscribe({
      next: () => {
        this.mostrarMensagem('Atualizado com sucesso!');
      },
      error: (err) => {
        console.log(err);
        this.mostrarMensagem('Erro ao atualizar!');
      }
    });
  }
}

  resetForm(): Clinica {
    return {
      id: 0,
      nome: '',
      telefone: '',
      endereco: '',
      numero: null,
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: '',
      cep: ''
    };
  }

  mostrarMensagem(mensagem: string) {
    this.snack.open(mensagem, "Ok");
  }

  voltar(){
    this.router.navigate(['/lista-clinica']);
  }

  limpar() {
    this.clinica = this.resetForm();
    this.municipios = [];
  }

}