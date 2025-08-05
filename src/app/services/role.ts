import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Roles } from '../interfaces/roles';
import { RoleCreateRequest } from '../interfaces/role-create-request';
@Injectable({
  providedIn: 'root'
})
export class Role {
  apiUrl = environment.apiUrl;
  
  constructor(private http:HttpClient){}

  getRoles = (): Observable<Roles[]> =>
    this.http.get<Roles[]>(`${this.apiUrl}roles`);

  createRole = (role: RoleCreateRequest): Observable<{ message: string }> =>
    this.http.post<{ message: string }>(`${this.apiUrl}roles`, role);

  delete = (id: string): Observable<{ message: string }> =>
    this.http.delete<{ message: string }>(`${this.apiUrl}roles/${id}`);

  assignRole = (
    userId: string,
    roleId: string
  ): Observable<{ message: string }> =>
    this.http.post<{ message: string }>(`${this.apiUrl}roles/assign`, {
      userId,
      roleId,
       });
}
