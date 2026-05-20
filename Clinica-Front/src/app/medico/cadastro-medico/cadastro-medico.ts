import '@angular/common/locales/global/pt';
import { Component, OnInit, inject, ChangeDetectorRef  } from '@angular/core';
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
import { MatDatepickerModule, MatDatepickerIntl } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { NgxMaskDirective , provideNgxMask } from 'ngx-mask';

import { ActivatedRoute, Router } from '@angular/router';

import { APP_DATE_PROVIDER } from '../../date-format';

import { MedicoService } from '../../services/medicoapi.service';
import { Medico } from '../../models/medico.models';
import { BrasilapiService } from '../../services/brasilapi.service';
import { Estado, Municipio } from '../../models/brasilapi.models';
import { MeuDatepickerIntl } from '../../datepicker-intl';

@Component({
  selector: 'app-cadastro-medico',
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
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective
  ], providers: [
      provideNgxMask(),
      APP_DATE_PROVIDER,
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
      { provide: MatDatepickerIntl, useClass: MeuDatepickerIntl }
    ],
  templateUrl: './cadastro-medico.html',
  styleUrl: './cadastro-medico.scss',
})
export class CadastroMedico implements OnInit {

  camposForm!: FormGroup;
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private service: MedicoService,
    private brasilApiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.dateAdapter.setLocale('pt-BR');

    this.camposForm = new FormGroup({
      id: new FormControl(0),
      nome: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      rg: new FormControl('', Validators.required),
      dataNascimento: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      email: new FormControl(''),
      especializacao: new FormControl('', Validators.required),
      crm: new FormControl('', Validators.required),
      endereco: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
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

      this.service.buscarMedicoPorId(Number(id)).subscribe({
        next: (medicoEncontrado) => {
          const dataFormatada = medicoEncontrado.dataNascimento
            ? new Date(medicoEncontrado.dataNascimento)
                .toISOString()
                .split('T')[0]
            : '';

          this.camposForm.patchValue({
            ...medicoEncontrado,
            dataNascimento: dataFormatada
          });

          if (medicoEncontrado.estado) {
            this.brasilApiService
              .listarMunicipios(medicoEncontrado.estado)
              .subscribe({
                next: (lista) => {
                  this.municipios = lista.sort((a, b) =>
                    a.nome.localeCompare(b.nome)
                  );
                  this.camposForm.patchValue({
                    cidade: medicoEncontrado.cidade
                  });
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

    const data = this.camposForm.value.dataNascimento;

    const medico: Medico = {
      ...this.camposForm.value,
      dataNascimento: new Date(data).toISOString()
    };

    if (!this.atualizando) {
      this.service.salvar(medico).subscribe({
        next: () => {
          this.mostrarMensagem('Salvo com sucesso!');
          this.router.navigate(['/lista-medico']);
        },
        error: (err) => {
          console.log(err.error);
          this.mostrarMensagem('Erro ao salvar!');
        }
      });
    } else {
      this.service.atualizar(medico).subscribe({
        next: () => {
          this.mostrarMensagem('Atualizado com sucesso!');
        },
        error: (err) => {
          console.log(err.error);
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
    this.router.navigate(['/lista-medico']);
  }

  limpar() {
    this.camposForm.reset();
    this.municipios = [];
  }

}
