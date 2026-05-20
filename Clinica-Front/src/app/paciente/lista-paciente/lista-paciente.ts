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

import { PacienteService } from '../../services/pacienteapi.service';
import { Paciente } from '../../models/paciente.models';

import { BrasilapiService } from '../../services/brasilapi.service';
import { Estado, Municipio } from '../../models/brasilapi.models';

@Component({
  selector: 'app-lista-paciente',
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
  templateUrl: './lista-paciente.html',
  styleUrl: './lista-paciente.scss',
})
export class ListaPaciente implements OnInit {

  nomeBusca: string = '';
  estadoBusca: string = '';
  cidadeBusca: string = '';

  estados: Estado[] = [];
  municipios: Municipio[] = [];
  listaPacientesOriginal: Paciente[] = [];
  listaPacientes: Paciente[] = [];
  colunasTable: string[] = ["id", "nome", "estado","cidade", "telefone", "acoes"];
  snack: MatSnackBar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: PacienteService,
    private brasilApiService: BrasilapiService,
    private router: Router
  ){
    
  }

  ngOnInit() {
    this.carregarEstados();
    this.service.pesquisarPacientes('').subscribe({
      next: dados => {
        this.listaPacientesOriginal = [...dados];
        this.listaPacientes = [...dados];
        this.dataSource.data = this.listaPacientes;
      }
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

  pesquisar() {
    this.listaPacientes = this.listaPacientesOriginal.filter(paciente => {
      const nomeOk =
        !this.nomeBusca ||
        paciente.nome?.toLowerCase()
          .includes(this.nomeBusca.toLowerCase());

      const estadoOk =
        !this.estadoBusca ||
        paciente.estado === this.estadoBusca;

      const cidadeOk =
        !this.cidadeBusca ||
        paciente.cidade === this.cidadeBusca;

      return nomeOk && estadoOk && cidadeOk;
    });
    this.dataSource.data = this.listaPacientes;
  }

  preparaEditar(id: string){
    this.router.navigate(['/cadastro-paciente'], { queryParams: { "id": id } } )
  }

  preparaDeletar(paciente: Paciente){
    paciente.deletando = true;
  }

  deletar(paciente: Paciente) {

  this.service.deletar(paciente.id).subscribe({

    next: () => {

      this.listaPacientesOriginal =
        this.listaPacientesOriginal.filter(
          x => x.id !== paciente.id
        );

      this.listaPacientes =
        this.listaPacientes.filter(
          x => x.id !== paciente.id
        );

      this.dataSource.data = this.listaPacientes;

      this.snack.open(
        'Item deletado com sucesso!',
        'Ok'
      );

    },

    error: erro => console.log(erro)

  });

}

  novo() {
    this.router.navigate(['/cadastro-paciente']);
  }

  limpar() {
    this.nomeBusca = '';
    this.estadoBusca = '';
    this.cidadeBusca = '';
    this.municipios = [];
    this.dataSource.data = this.listaPacientes;
  }

  limparBusca() {
    this.nomeBusca = '';
    this.service.pesquisarPacientes('').subscribe({
      next: dados => {
        this.listaPacientes = [...dados];
        this.dataSource.data = dados;
      },
      error: erro => console.log(erro)
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}