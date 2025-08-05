import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const matSnackbar = inject(MatSnackBar);

  if (!authService.isLoggedIn()) {
    matSnackbar.open('Debes iniciar sesión para ver esta página.', 'Ok', {
      duration: 3000,
    });
    router.navigate(['/login']);
    return false;
  }

  const user = authService.getUserDetail();

  // Bloquear acceso de administradores a "/"
  if ((state.url === '/' || state.url === '/home') && user?.roles?.includes('Administrador')) {

    matSnackbar.open('Redirigido al panel de administración.', 'Ok', {
      duration: 3000,
    });
    router.navigate(['/dashboard']); // Ajusta esta ruta si es distinta
    return false;
  }

  if (state.url === '/' && user?.roles?.includes('Cliente')) {
    matSnackbar.open('Redirigido al panel de Cliente.', 'Ok', {
      duration: 3000,
    });
    router.navigate(['/home']); // Ajusta esta ruta si es distinta
    return false;
  }

  return true;
};
