import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, of } from 'rxjs'; 

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(Auth);
  const router = inject(Router);
  let isRefreshing = false; 

  console.log('Interceptor: Iniciando para URL:', req.url);

  if (req.url.includes('account/login') || req.url.includes('account/refresh-token')) {
    console.log('Interceptor: Saltando token para URL de autenticación/refresco.');
    return next(req);
  }

  const token = authService.getToken();
  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    console.log('Interceptor: Token JWT añadido al encabezado de la petición.', token.substring(0, 30) + '...');
  } else {
    console.log('Interceptor: No se encontró token, continuando la petición sin él.');
    return next(req);
  }

  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      console.error('Interceptor: Error en la petición:', err.status, err.message, err.url);
      if (err.status === 401) {
        console.log('Interceptor: Error 401 detectado.');

        if (!isRefreshing) {
          isRefreshing = true;
          console.log('Interceptor: Intentando refrescar token (primera vez).');

          return authService.refreshToken({
            email: authService.getUserDetail()?.email,
            token: authService.getToken() || '',
            refreshToken: authService.getRefreshToken() || '',
          }).pipe(
            switchMap((response) => {
              isRefreshing = false;
              if (response.isSuccess) {
                localStorage.setItem('user', JSON.stringify(response));
                console.log('Interceptor: Refresh exitoso, reintentando petición original con nuevo token.');
                const newClonedReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.token}`,
                  },
                });
                return next(newClonedReq);
              } else {
                console.error('Interceptor: Refresh fallido o respuesta no exitosa. Cerrando sesión.');
                authService.logout();
                router.navigate(['/login']);
                return throwError(() => new Error('Refresh token failed')); 
              }
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              console.error('Interceptor: Error al intentar refrescar el token. Cerrando sesión.', refreshErr);
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshErr);
            })
          );
        } else {
          console.warn('Interceptor: Ya hay una solicitud de refresh en progreso. Propagando el 401 actual.');
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => err);
        }
      }
      return throwError(() => err); 
    })
  );
};