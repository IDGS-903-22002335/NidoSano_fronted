import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from  '@angular/material/select'
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Role } from '../../services/role';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Roles } from '../../interfaces/roles';
import { Auth } from '../../services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-errors';

@Component({
  selector: 'app-register-administrator',
  imports: [MatInputModule,
    ReactiveFormsModule, 
    RouterLink,
    MatSelectModule
    , MatIconModule,
    MatSnackBarModule,
    AsyncPipe,
    CommonModule],
  templateUrl: './register-administrator.html',
  styleUrl: './register-administrator.css'
})
export class RegisterAdministrator implements OnInit {
  roleService = inject(Role)
  authService = inject(Auth)
  matSnackbar = inject(MatSnackBar)
  roles$!:Observable<Roles[]>;

  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  router = inject(Router);
  confirmPasswordHide: boolean = true;
  passwordHide: boolean = true;
  errors!: ValidationError[];

  register() {
    const role = this.registerForm.get('roles')?.value || '';

    const registrationData = {
      ...this.registerForm.value,
      roles: role,
    };

    console.log(this.registerForm.value);
    console.log(registrationData);
    console.log(role);
    this.authService.register(registrationData).subscribe({
      next: (response) => {
        console.log(response);

        this.matSnackbar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err!.status === 400) {
          this.errors = err!.error;
          this.matSnackbar.open('Validations error', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
        }
      },
      complete: () => console.log('Register success'),
    });
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        fullName: ['', Validators.required],
        lastName: ['', Validators.required],  
        address: [''],
        city: [''],
        state: [''],
      phoneNumber: [''],
        confirmPassword: ['', Validators.required],
        roles: [['Administrador ']],

      },
      {
        validator: this.passwordMatchValidator,
      }
    );

    this.roles$ = this.roleService.getRoles();
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}