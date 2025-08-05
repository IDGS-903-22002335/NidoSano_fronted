import { Component, inject } from '@angular/core';
import { Role } from '../../services/role';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { Auth } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RoleList } from '../../component/role-list/role-list';
import { RoleForm } from '../../component/role-form/role-form';

@Component({
  selector: 'app-role-component',
  imports: [RoleForm,
    MatSelectModule,
    MatInputModule,
    AsyncPipe,
    MatSnackBarModule,RoleList],
  templateUrl: './role-component.html',
  styleUrl: './role-component.css'
})
export class RoleComponent {
roleService = inject(Role);
 authService = inject(Auth);
errorMessage = '';
role: RoleCreateRequest = {} as RoleCreateRequest;
roles$ = this.roleService.getRoles();
  users$ = this.authService.getAll();
  selectedUser: string = '';
  selectedRole: string = '';

  
  snackbar = inject(MatSnackBar);

createRole(role: RoleCreateRequest){
    this.roleService.createRole(role).subscribe({
      next: (response: { message: string }) => {
        this.roles$ = this.roleService.getRoles();
        this.snackbar.open('Role Created Successfully', 'Ok', {
          duration: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          this.errorMessage = error.error;
        }
      },
    });
  }

    deleteRole(id: string) {
    this.roleService.delete(id).subscribe({
      next: (response) => {
        this.roles$ = this.roleService.getRoles();
        this.snackbar.open('Role Deleted Successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackbar.open(error.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }

  assignRole() {
    this.roleService
      .assignRole(this.selectedUser, this.selectedRole)
      .subscribe({
        next: (response) => {
          this.roles$ = this.roleService.getRoles();
          this.snackbar.open('Role Assign Successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.snackbar.open(error.message, 'Close', {
            duration: 3000,
          });
        },
      });
  }
}
