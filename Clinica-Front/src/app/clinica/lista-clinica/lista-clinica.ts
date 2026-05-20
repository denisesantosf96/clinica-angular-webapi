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

import { ClinicaService } from '../../services/clinicaapi.service';
import { Clinica } from '../../models/clinica.models';

import { BrasilapiService } from '../../services/brasilapi.service';
import { Estado, Municipio } from '../../models/brasilapi.models';

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
    MatButtonModule,
    MatSelectModule,
    MatPaginator
  ],
  templateUrl: './lista-clinica.html',
  styleUrl: './lista-clinica.scss',
})
export class ListaClinica implements OnInit {

  nomeBusca: string = '';
  estadoBusca: string = '';
  cidadeBusca: string = '';

  estados: Estado[] = [];
  municipios: Municipio[] = [];
  listaClinicasOriginal: Clinica[] = [];
  listaClinicas: Clinica[] = [];
  colunasTable: string[] = ["id", "nome", "estado","cidade", "telefone", "acoes"];
  snack: MatSnackBar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: ClinicaService,
    private brasilApiService: BrasilapiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){
    
  }

  ngOnInit() {
    this.carregarEstados();
    this.service.pesquisarClinicas('').subscribe({
      next: dados => {
        this.listaClinicasOriginal = [...dados];
        this.dataSource.data = dados;
        this.cdr.detectChanges();
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
    this.listaClinicas = this.listaClinicasOriginal.filter(clinica => {
      const nomeOk =
        !this.nomeBusca ||
        clinica.nome?.toLowerCase()
          .includes(this.nomeBusca.toLowerCase());

      const estadoOk =
        !this.estadoBusca ||
        clinica.estado === this.estadoBusca;

      const cidadeOk =
        !this.cidadeBusca ||
        clinica.cidade === this.cidadeBusca;

      return nomeOk && estadoOk && cidadeOk;
    });
    this.dataSource.data = this.listaClinicas;
    this.cdr.detectChanges();
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

  limpar() {
   this.nomeBusca = '';
  this.estadoBusca = '';
  this.cidadeBusca = '';
  this.municipios = [];
  this.dataSource.data = this.listaClinicas;
  this.cdr.detectChanges();
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
