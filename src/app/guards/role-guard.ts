import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data['roles'] as string[];
  const authService = inject(Auth);
  const matSnackBar = inject(MatSnackBar);

  const router = inject(Router);
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    matSnackBar.open('Debes iniciar sesión para ver esta página.', 'OK', {
      duration: 3000,
    });
    return false;
  }
  const userRoles = authService.getRoles();
  console.log(userRoles);
  console.log(roles);

  if (roles.some((role) => userRoles?.includes(role))) return true;
  router.navigate(['/']);
  matSnackBar.open('No tienes permiso para ver esta página.', 'OK', {
    duration: 3000,
  });
  return false;
};
