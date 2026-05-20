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

import { ActivatedRoute, Router } from '@angular/router';

import { EspecialidadeService } from '../../services/especialidadeapi.service';
import { Especialidade } from '../../models/especialidade.models';

@Component({
  selector: 'app-cadastro-especialidade',
  imports: [
    FlexLayoutModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './cadastro-especialidade.html',
  styleUrl: './cadastro-especialidade.scss',
})
export class CadastroEspecialidade implements OnInit {

  camposForm!: FormGroup;
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);

  constructor(
    private service: EspecialidadeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.camposForm = new FormGroup({
      id: new FormControl(0),
      nome: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required)
    });
  

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');

      if (!id) return;

      this.atualizando = true;

      this.service.buscarEspecialidadePorId(Number(id)).subscribe({
        next: (especialidadeEncontrada) => {
          this.camposForm.patchValue(especialidadeEncontrada);
          setTimeout(() => {
            this.cdr.detectChanges();
          });          
        }
      });
    });
  }
 

  salvar() {
    this.camposForm.markAllAsTouched();

    if (this.camposForm.invalid) {
      return;
    }

    const especialidade: Especialidade = this.camposForm.value;

    if (!this.atualizando) {
      this.service.salvar(especialidade).subscribe({
        next: () => {
          this.mostrarMensagem('Salvo com sucesso!');
          this.router.navigate(['/lista-especialidade']);
        },
        error: (err) => {
          console.log(err);
          this.mostrarMensagem('Erro ao salvar!');
        }
      });
    } else {
      this.service.atualizar(especialidade).subscribe({
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
    this.router.navigate(['/lista-especialidade']);
  }

  limpar() {
    this.camposForm.reset();
  }

}
