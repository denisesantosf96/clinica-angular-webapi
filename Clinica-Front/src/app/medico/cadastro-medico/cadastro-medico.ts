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

import { NgxMaskDirective , provideNgxMask } from 'ngx-mask';

import { ActivatedRoute, Router } from '@angular/router';

import { MedicoService } from '../../services/medicoapi.service';
import { Medico } from '../../models/medico.models';
import { BrasilapiService } from '../../services/brasilapi.service';
import { Estado, Municipio } from '../../models/brasilapi.models';

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
    NgxMaskDirective
  ], providers: [
      provideNgxMask(),
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
  cpfDuplicado = false;
  rgDuplicado = false;
  crmDuplicado = false;

  constructor(
    private service: MedicoService,
    private brasilApiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

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
                .toLocaleDateString('pt-BR')
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

    console.log('Data:', data);
        console.log('Tipo:', typeof data);
    
        const [dia, mes, ano] = data.split('/');
    
        console.log('Dia:', dia);
        console.log('Mês:', mes);
        console.log('Ano:', ano);
    
        const dataNascimento = new Date(
            Number(ano),
            Number(mes) - 1,
            Number(dia)
        );
    
        console.log('Date:', dataNascimento);
        console.log('isValid:', !isNaN(dataNascimento.getTime()));
    
        const medico: Medico  = {
        ...this.camposForm.value,
        dataNascimento: dataNascimento.toISOString()
        };

    if (!this.atualizando) {
      this.service.salvar(medico).subscribe({
        next: () => {
          this.mostrarMensagem('Salvo com sucesso!');
          this.router.navigate(['/lista-medico']);
        },
        error: (err) => {
          this.cpfDuplicado = false;
          this.rgDuplicado = false;
          this.crmDuplicado = false;

          if (err.error === 'CPF já cadastrado.') {
            this.cpfDuplicado = true;
            this.camposForm.get('cpf')?.setErrors({
              cpfDuplicado: true
            });
          }

          if (err.error === 'RG já cadastrado.') {
            this.rgDuplicado = true;
            this.camposForm.get('rg')?.setErrors({
              rgDuplicado: true
            });
          } 

          if (err.error === 'CRM já cadastrado.') {
            this.crmDuplicado = true;
            this.camposForm.get('crm')?.setErrors({
              crmDuplicado: true
            });
          }

          this.mostrarMensagem(err.error);
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
