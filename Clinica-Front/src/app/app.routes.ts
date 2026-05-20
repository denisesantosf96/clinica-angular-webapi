import { Routes } from '@angular/router';
import { CadastroClinica } from './clinica/cadastro-clinica/cadastro-clinica'
import { ListaClinica } from './clinica/lista-clinica/lista-clinica';
import { CadastroPaciente } from './paciente/cadastro-paciente/cadastro-paciente'
import { ListaPaciente } from './paciente/lista-paciente/lista-paciente'
import { CadastroEspecialidade } from './especialidade/cadastro-especialidade/cadastro-especialidade'
import { ListaEspecialidade } from './especialidade/lista-especialidade/lista-especialidade'
import { CadastroMedico } from './medico/cadastro-medico/cadastro-medico'
import { ListaMedico } from './medico/lista-medico/lista-medico'

export const routes: Routes = [
    { path: 'cadastro-clinica', component: CadastroClinica },
    { path: 'lista-clinica', component: ListaClinica },
    { path: 'cadastro-paciente', component: CadastroPaciente },
    { path: 'lista-paciente', component: ListaPaciente },
    { path: 'cadastro-especialidade', component: CadastroEspecialidade },
    { path: 'lista-especialidade', component: ListaEspecialidade },
    { path: 'cadastro-medico', component: CadastroMedico },
    { path: 'lista-medico', component: ListaMedico }
];
