import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/User-detail';
import { ResetPasswordRequest } from '../interfaces/ResetPasswordRequest';
import { ChangePasswordRequest } from '../interfaces/ChangePasswordRequest';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  apiUrl: string = environment.apiUrl;
  private userKey = 'user';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}account/login`, data).pipe(
      map((response) => {
        if (response.isSuccess) {
          localStorage.setItem(this.userKey, JSON.stringify(response))
          console.log('Auth Service: Login exitoso, usuario guardado en localStorage.', response);
        } else {
          console.error('Auth Service: Fallo en el login.', response);
        }
        return response;
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}account/register`, data);
  }

  getDetail = (): Observable<UserDetail> =>
    this.http.get<UserDetail>(`${this.apiUrl}account/detail`);

  forgotPassword = (email: string): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}account/forgot-password`, {
      email,
    });

  resetPassword = (data: ResetPasswordRequest): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}account/reset-password`, data);

  changePassword = (data: ChangePasswordRequest): Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}account/change-password`, data);

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) {
      console.warn('Auth Service: getUserDetail: Token no encontrado.');
      return null;
    }
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };
    console.log('Auth Service: getUserDetail: Detalles del usuario decodificados.', userDetail);
    return userDetail;
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    const expired = this.isTokenExpired(); 

    console.log(`Auth Service: isLoggedIn: Token presente: ${!!token}, Token expirado (según isTokenExpired): ${expired}`);
    if (!token || expired) {
      if (token && expired) {
        console.warn('Auth Service: isLoggedIn: Token existe pero está expirado.');
        this.logout();
      } else if (!token) {
        console.warn('Auth Service: isLoggedIn: No se encontró token.');
      }
      return false;
    }
    return true;
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('Auth Service: isTokenExpired: No hay token, se considera expirado.');
      return true;
    }
    try {
      const decoded: any = jwtDecode(token);
      const isExpired = (decoded.exp * 1000) < Date.now();
      console.log(`Auth Service: isTokenExpired: Token exp: ${new Date(decoded.exp * 1000)}, Ahora: ${new Date(Date.now())}, Expirado: ${isExpired}`);
      return isExpired;
    } catch (e) {
      console.error('Auth Service: isTokenExpired: Error al decodificar el token, token inválido.', e);
      return true; 
    }
  }

  logout = (): void => {
    console.log('Auth Service: logout: Eliminando usuario de localStorage y redirigiendo.');
    localStorage.removeItem(this.userKey);
  }

  getRoles = (): string[] | null => {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role || null;
    } catch (e) {
      console.error('Auth Service: getRoles: Error al decodificar token para roles.', e);
      return null;
    }
  };

  getAll = (): Observable<UserDetail[]> =>
    this.http.get<UserDetail[]>(`${this.apiUrl}account`);

  refreshToken = (data: {
    refreshToken: string;
    email: string;
    token: string;
  }): Observable<AuthResponse> => {
    console.log('Auth Service: refreshToken: Intentando refrescar token.', data);
    return this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`, data).pipe(
      map(response => {
        if (response.isSuccess) {
          console.log('Auth Service: refreshToken: Refresh exitoso.', response);
        } else {
          console.error('Auth Service: refreshToken: Fallo en el refresh.', response);
        }
        return response;
      }),
      catchError(err => {
        console.error('Auth Service: refreshToken: Error en la llamada al refresh token.', err);
        return throwError(() => err);
      })
    );
  }

  getToken = (): string | null => {
    const user = localStorage.getItem(this.userKey);
    if (!user) {
      console.log('Auth Service: getToken: No se encontró usuario en localStorage.');
      return null;
    }
    const userDetail: AuthResponse = JSON.parse(user);
    console.log('Auth Service: getToken: Token obtenido de localStorage.', userDetail.token ? 'Token presente' : 'Token ausente');
    return userDetail.token;
  };

  getRefreshToken = (): string | null => {
    const user = localStorage.getItem(this.userKey);
    if (!user) {
      console.log('Auth Service: getRefreshToken: No se encontró usuario en localStorage.');
      return null;
    }
    const userDetail: AuthResponse = JSON.parse(user);
    console.log('Auth Service: getRefreshToken: Refresh token obtenido de localStorage.', userDetail.refreshToken ? 'Refresh token presente' : 'Refresh token ausente');
    return userDetail.refreshToken;
  };
}