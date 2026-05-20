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
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { EspecialidadeService } from '../../services/especialidadeapi.service';
import { Especialidade } from '../../models/especialidade.models';

@Component({
  selector: 'app-lista-especialidade',
  imports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatPaginator
  ],
  templateUrl: './lista-especialidade.html',
  styleUrl: './lista-especialidade.scss',
})
export class ListaEspecialidade implements OnInit {

  nomeBusca: string = '';
  listaEspecialidadesOriginal: Especialidade[] = [];
  listaEspecialidades: Especialidade[] = [];
  colunasTable: string[] = ["id", "nome", "tipo", "acoes"];
  snack: MatSnackBar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: EspecialidadeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){
    
  }

  ngOnInit() {
    this.service.pesquisarEspecialidades('').subscribe({
      next: dados => {
        this.listaEspecialidadesOriginal = [...dados];
        this.listaEspecialidades = [...dados];
        this.dataSource.data = dados;
        this.cdr.detectChanges();
      }
    });
  }

  pesquisar() {
    this.listaEspecialidades = this.listaEspecialidadesOriginal.filter(especialidade => {
      const nomeOk =
        !this.nomeBusca ||
        especialidade.nome?.toLowerCase()
          .includes(this.nomeBusca.toLowerCase());
      return nomeOk;
    });
    this.dataSource.data = this.listaEspecialidades;
    this.cdr.detectChanges();
  }

  preparaEditar(id: string){
    this.router.navigate(['/cadastro-especialidade'], { queryParams: { "id": id } } )
  }

  preparaDeletar(especialidade: Especialidade){
    especialidade.deletando = true;
  }

  deletar(especialidade: Especialidade) {
    this.service.deletar(especialidade.id).subscribe({
      next: () => {
        this.listaEspecialidades = this.listaEspecialidades.filter(
          x => x.id !== especialidade.id
        );
        this.listaEspecialidades = [...this.listaEspecialidades];
        this.cdr.detectChanges();
        this.snack.open('Item deletado com sucesso!', 'Ok');
      },
      error: erro => console.log(erro)
    });
  }

  novo() {
    this.router.navigate(['/cadastro-especialidade']);
  }

  limpar() {
    this.nomeBusca = '';
    this.listaEspecialidades = [...this.listaEspecialidadesOriginal];
    this.dataSource.data = this.listaEspecialidades;
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}