import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../services/role';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Roles } from '../../interfaces/roles';
import { Auth } from '../../services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-errors';
import { ActivatedRoute } from '@angular/router';
import { Admin } from '../../services/admin';

@Component({
  selector: 'app-registerpossible-client',
  imports: [    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    CommonModule],
  templateUrl: './registerpossible-client.html',
  styleUrl: './registerpossible-client.css'
})
export class RegisterpossibleClient {
roleService = inject(Role);
  authService = inject(Auth);
  matSnackbar = inject(MatSnackBar);
  roles$!: Observable<Roles[]>;

  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  router = inject(Router);
  confirmPasswordHide: boolean = true;
  passwordHide: boolean = true;
  errors!: ValidationError[];
  clienteId!: string;
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private adminService: Admin) {}

  ngOnInit(): void {
    this.initializeForm();
    this.roles$ = this.roleService.getRoles();

    this.clienteId = this.route.snapshot.paramMap.get('id') || '';
    if (this.clienteId) {
      this.cargarCliente(this.clienteId);
    }
  }

  initializeForm() {
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
        roles: [['Cliente']],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  cargarCliente(id: string) {
    this.isLoading = true;
    this.adminService.getPossibleClientById(id).subscribe({
      next: (res) => {
        console.log('Datos cliente:', res);
        this.registerForm.patchValue({
          email: res.email,
          fullName: res.name,  // Asegúrate que coincida con la API
          lastName: res.lastName,
          city: res.city,
          state: res.state,
          phoneNumber: res.phoneNumber
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando cliente:', err);
        this.matSnackbar.open('Error al cargar datos del cliente', 'Cerrar', {
          duration: 5000,
        });
        this.isLoading = false;
      }
    });
  }

  register() {
  if (this.registerForm.invalid) return;

  const registrationData = {
    ...this.registerForm.value,
    roles: this.registerForm.get('roles')?.value || '',
  };

  this.authService.register(registrationData).subscribe({
    next: (response: any) => {
      this.matSnackbar.open(response.message, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
      });

      const clienteId = response.idPossibleClient || response.id || this.clienteId;

      if (clienteId) {
        this.adminService.setStatusToOne(clienteId).subscribe({
          next: () => {
            console.log('Status actualizado a 1 para el cliente:', clienteId);
            this.router.navigate(['/posible_cliente']); 
          },
          error: (err) => {
            console.error('Error actualizando status:', err);
          }
        });
      } else {
        this.router.navigate(['/possible-clients']);
      }
    },
    error: (err: HttpErrorResponse) => {
      if (err.status === 400) {
        this.errors = err.error;
        this.matSnackbar.open('Error de validación', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
        });
      }
    }
  });
}


  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password !== confirmPassword ? { passwordMismatch: true } : null;
  }
}
