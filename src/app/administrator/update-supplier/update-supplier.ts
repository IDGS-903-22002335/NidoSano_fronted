import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Admin } from '../../services/admin'; // Ajusta ruta
import { SupplierDto } from '../../interfaces/Supplier'; // Ajusta ruta
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-supplier.html',
  styleUrls: ['./update-supplier.css']
})
export class UpdateSupplier implements OnInit {
  supplierForm: FormGroup;
  supplierId: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: Admin,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.supplierId = this.route.snapshot.paramMap.get('idSupplier') || '';
    if (this.supplierId) {
      this.adminService.getSupplierById(this.supplierId).subscribe({
        next: (supplier) => {
          this.supplierForm.patchValue({
            name: supplier.name,
            phoneNumber: supplier.phoneNumber,
            email: supplier.email,
            address: supplier.address
          });
        },
        error: (err) => {
          console.error('Error cargando proveedor', err);
          this.snackBar.open('Error al cargar datos del proveedor', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/proveedores']); // Regresa si hay error
        }
      });
    }
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      const updatedSupplier: SupplierDto = {
        idSupplier: this.supplierId,
        name: this.supplierForm.value.name,
        phoneNumber: this.supplierForm.value.phoneNumber,
        email: this.supplierForm.value.email,
        address: this.supplierForm.value.address,
        registrationDate: '', // Puedes dejar vacío o no enviar si no lo actualizas
        status: 1 // o el estado actual que manejes
      };

      this.adminService.UpdateSupplier(updatedSupplier).subscribe({
        next: () => {
          this.snackBar.open('Proveedor actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/proveedores']);
        },
        error: (err) => {
          console.error('Error actualizando proveedor', err);
          this.snackBar.open('Error al actualizar proveedor', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
