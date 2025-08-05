import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierDto } from '../../interfaces/Supplier';
import { Admin } from '../../services/admin';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-supplier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './register-supplier.html',
  styleUrls: ['./register-supplier.css'],
})
export class RegisterSupplier {
  supplierForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supplierService: Admin,
    private snackBar: MatSnackBar,
  private router: Router
  ) {
    this.supplierForm = this.fb.group({
      Name: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Address: ['', Validators.required],
      RegistrationDate: [new Date()], // ISO string con fecha actual
      status: ['1'] // 1 = activo
    });
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      const supplier: SupplierDto = this.supplierForm.value;

      this.supplierService.createSupplier(supplier).subscribe({
        next: (res) => {
          this.snackBar.open('Proveedor registrado correctamente', 'Cerrar', { duration: 3000 });
          this.supplierForm.reset();
          this.router.navigate(['/proveedores']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al registrar proveedor', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
