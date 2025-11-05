import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
export const routes: Routes = [
  {
    path:'',
    redirectTo: 'login',
    pathMatch:'full'
  },
  {
        path: 'login',
        // Carga diferida (lazy loading) de tu componente standalone
        loadComponent: () => import('./components/login/login')
                                .then(m => m.LoginComponent)
  },
  {
        path: 'registro',
        loadComponent: () => import('./components/registro/registro')
                                .then(m => m.RegistroComponent)
  },
  {
        path: 'todos',
        loadComponent: () => import('./components/todo-list/todo-list')
                                .then(m => m.TodoListComponent),
        canActivate: [authGuard] // 3. Aplica el guardián aquí
    },

    // --- RUTA 'Catch-all' ---
    // (Opcional: si visita cualquier otra cosa, lo mandas al login o a 'todos')
    { 
        path: '**', 
        redirectTo: 'todos' 
    }
];
