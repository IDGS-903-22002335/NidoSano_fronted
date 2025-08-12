import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const matSnackbar = inject(MatSnackBar);

  console.log(`Auth Guard: Intentando activar ruta: ${state.url}`);

  if (!authService.isLoggedIn()) {
    console.warn('Auth Guard: Usuario NO autenticado o token expirado. Redirigiendo a login.');
    matSnackbar.open('Debes iniciar sesión para ver esta página.', 'Ok', {
      duration: 3000,
    });
    router.navigate(['/login']);
    return false;
  }

  console.log('Auth Guard: Usuario autenticado. Verificando roles...');
  const user = authService.getUserDetail();

  if ((state.url === '/' || state.url === '/home') && user?.roles?.includes('Administrador')) {
    console.log('Auth Guard: Administrador intentando acceder a ruta de cliente. Redirigiendo a dashboard.');
    matSnackbar.open('Redirigido al panel de administración.', 'Ok', {
      duration: 3000,
    });
    router.navigate(['/dashboard']); 
    return false;
  }

  if (state.url === '/' && user?.roles?.includes('Cliente')) {
    console.log('Auth Guard: Cliente intentando acceder a ruta raíz. Redirigiendo a home.');
    matSnackbar.open('Redirigido al panel de Cliente.', 'Ok', {
      duration: 3000,
    });
    router.navigate(['/home']); 
    return false;
  }

  console.log('Auth Guard: Acceso permitido a la ruta.');
  return true;
};