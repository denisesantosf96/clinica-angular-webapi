import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

import { ClinicaService } from '../../services/clinicaapi.service';
import { Clinica } from '../../models/clinica.models';

@Component({
  selector: 'app-lista-clinica',
  imports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './lista-clinica.html',
  styleUrl: './lista-clinica.scss',
})
export class ListaClinica implements OnInit {

  nomeBusca: string = '';
  listaClinicas: Clinica[] = [];
  colunasTable: string[] = ["id", "nome", "cidade", "telefone", "acoes"];
  snack: MatSnackBar = inject(MatSnackBar);

  constructor(
    private service: ClinicaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){

  }

  ngOnInit() {
  this.service.pesquisarClinicas('').subscribe({
    next: dados => {
      this.listaClinicas = dados;
      this.cdr.detectChanges();
    }
  });
}

pesquisar(){
  this.service.pesquisarClinicas(this.nomeBusca).subscribe({
    next: dados => this.listaClinicas = dados,
    error: erro => console.log(erro)
  });
}

  preparaEditar(id: string){
    this.router.navigate(['/cadastro-clinica'], { queryParams: { "id": id } } )
  }

  preparaDeletar(clinica: Clinica){
    clinica.deletando = true;
  }

  deletar(clinica: Clinica) {
    this.service.deletar(clinica.id).subscribe({
      next: () => {
        this.listaClinicas = this.listaClinicas.filter(
          x => x.id !== clinica.id
        );
        this.listaClinicas = [...this.listaClinicas];
        this.cdr.detectChanges();
        this.snack.open('Item deletado com sucesso!', 'Ok');
      },
      error: erro => console.log(erro)
    });
  }

  novo() {
    this.router.navigate(['/cadastro-clinica']);
  }

  limparBusca() {
    this.nomeBusca = '';
    this.service.pesquisarClinicas('').subscribe({
      next: dados => {
        this.listaClinicas = [...dados];
        this.cdr.detectChanges();
      },
      error: erro => console.log(erro)
    });
  }

}
