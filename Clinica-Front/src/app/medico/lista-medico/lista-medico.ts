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

import { MedicoService } from '../../services/medicoapi.service';
import { Medico } from '../../models/medico.models';

import { BrasilapiService } from '../../services/brasilapi.service';
import { Estado, Municipio } from '../../models/brasilapi.models';

@Component({
  selector: 'app-lista-medico',
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
  templateUrl: './lista-medico.html',
  styleUrl: './lista-medico.scss',
})
export class ListaMedico implements OnInit {

  nomeBusca: string = '';
  estadoBusca: string = '';
  cidadeBusca: string = '';

  estados: Estado[] = [];
  municipios: Municipio[] = [];
  listaMedicosOriginal: Medico[] = [];
  listaMedicos: Medico[] = [];
  colunasTable: string[] = ["id", "nome", "especializacao","estado","cidade", "telefone", "acoes"];
  snack: MatSnackBar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: MedicoService,
    private brasilApiService: BrasilapiService,
    private router: Router
  ){
    
  }

  ngOnInit() {
    this.carregarEstados();
    this.service.pesquisarMedicos('').subscribe({
      next: dados => {
        this.listaMedicosOriginal = [...dados];
        this.listaMedicos = [...dados];
        this.dataSource.data = this.listaMedicos;
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
    this.listaMedicos = this.listaMedicosOriginal.filter(medico => {
      const nomeOk =
        !this.nomeBusca ||
        medico.especializacao?.toLowerCase()
          .includes(this.nomeBusca.toLowerCase());

      const estadoOk =
        !this.estadoBusca ||
        medico.estado === this.estadoBusca;

      const cidadeOk =
        !this.cidadeBusca ||
        medico.cidade === this.cidadeBusca;

      return nomeOk && estadoOk && cidadeOk;
    });
    this.dataSource.data = this.listaMedicos;
  }

  preparaEditar(id: string){
    this.router.navigate(['/cadastro-medico'], { queryParams: { "id": id } } )
  }

  preparaDeletar(medico: Medico){
    medico.deletando = true;
  }

  deletar(medico: Medico) {
    this.service.deletar(medico.id).subscribe({
      next: () => {
        this.listaMedicosOriginal = this.listaMedicosOriginal.filter(
            x => x.id !== medico.id);
        this.listaMedicos = this.listaMedicos.filter(
            x => x.id !== medico.id);
        this.dataSource.data = this.listaMedicos;
        this.snack.open(
          'Item deletado com sucesso!',
          'Ok'
        );
      },
      error: erro => console.log(erro)
    });

  }

  novo() {
    this.router.navigate(['/cadastro-medico']);
  }

  limpar() {
    this.nomeBusca = '';
    this.estadoBusca = '';
    this.cidadeBusca = '';
    this.municipios = [];
    this.dataSource.data = this.listaMedicos;
  }

  limparBusca() {
    this.nomeBusca = '';
    this.service.pesquisarMedicos('').subscribe({
      next: dados => {
        this.listaMedicos = [...dados];
        this.dataSource.data = dados;
      },
      error: erro => console.log(erro)
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
