import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

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
    ReactiveFormsModule,
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
export class CadastroClinica implements OnInit {

  camposForm!: FormGroup;
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

    this.camposForm = new FormGroup({
      id: new FormControl(0),
      nome: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      endereco: new FormControl('', Validators.required),
      numero: new FormControl(null, Validators.required),
      complemento: new FormControl(''),
      bairro: new FormControl('', Validators.required),
      cidade: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      pais: new FormControl('', Validators.required),
      cep: new FormControl('', Validators.required)
    });
    
    this.carregarEstados();

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');

      if (!id) return;

      this.atualizando = true;

      this.service.buscarClinicaPorId(Number(id)).subscribe({
        next: (clinicaEncontrada) => {
          this.camposForm.patchValue(clinicaEncontrada);
          setTimeout(() => {
            this.cdr.detectChanges();
          });

          if (clinicaEncontrada.estado) {
            this.brasilApiService.listarMunicipios(clinicaEncontrada.estado).subscribe({
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
      next: lista => {
        this.estados = lista.sort((a, b) =>
          a.sigla.localeCompare(b.sigla)
        );
      }
    });
  }

  carregarMunicipios(uf: string) {
    this.municipios = [];

    return this.brasilApiService.listarMunicipios(uf).subscribe({
      next: lista => {
        this.municipios = lista.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
      },
      error: err => console.log(err)
    });
  }  

  salvar() {
    this.camposForm.markAllAsTouched();

    if (this.camposForm.invalid) {
      return;
    }

    const clinica: Clinica = this.camposForm.value;

    if (!this.atualizando) {
      this.service.salvar(clinica).subscribe({
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
      this.service.atualizar(clinica).subscribe({
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

  isCampoInvalido(nomeCampo: string): boolean {

    const campo = this.camposForm.get(nomeCampo);

    return !!(
      campo &&
      campo.invalid &&
      campo.touched
    );
  }

  mostrarMensagem(mensagem: string) {
    this.snack.open(mensagem, "Ok");
  }

  voltar(){
    this.router.navigate(['/lista-clinica']);
  }

  limpar() {
    this.camposForm.reset();
    this.municipios = [];
  }

}