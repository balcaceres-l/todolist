import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth';

/**
 * Functional Auth Guard
 * Revisa si el usuario está logueado
 */
export const authGuard: CanActivateFn = (route, state) => {
  
  // 1. Inyecta los servicios necesarios
  const authService = inject(AuthService);
  const router = inject(Router);

  // 2. Revisa si está logueado
  if (authService.isLoggedIn()) {
    return true; // Sí puede pasar
  } else {
    // 3. Si no, redirige a login
    router.navigate(['/login']);
    return false; // No puede pasar
  }
};