import { Routes } from '@angular/router';
import { CadastroClinicaComponent } from './clinica/cadastro-clinica/cadastro-clinica'
import { ListaClinica } from './clinica/lista-clinica/lista-clinica';

export const routes: Routes = [
    { path: 'cadastro-clinica', component: CadastroClinicaComponent },
    { path: 'lista-clinica', component: ListaClinica }
];
