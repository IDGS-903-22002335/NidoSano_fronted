import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';
import { SupplierDto } from '../../interfaces/Supplier';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier',
  imports: [
  MatTableModule,
  MatCardModule,
  MatButtonModule,
  CommonModule,
  RouterLink,
  FormsModule,
  
],

  templateUrl: './supplier.html',
  styleUrl: './supplier.css'
})
export class Supplier implements OnInit {
  suppliers: SupplierDto[] = [];
    filteredSuppliers: SupplierDto[] = [];
  searchTerm: string = '';

  constructor(private adminService: Admin,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

loadSuppliers(): void {
    this.adminService.getSupplier().subscribe({
      next: (res) => {
        this.suppliers = res;
        this.filteredSuppliers = res; // inicializar con todos
      },
      error: (err) => console.error('Error al obtener proveedores', err)
    });
  }

  filterSuppliers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredSuppliers = this.suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(term) ||
      supplier.phoneNumber.toLowerCase().includes(term) ||
      supplier.email.toLowerCase().includes(term)
    );
  }


  deleteSupplier(id: string): void {
    const supplierDelete = { idSupplier: id, status: 0 }; 
    this.adminService.deleteSupplier(supplierDelete).subscribe({
      next: () => {
        this.snackBar.open('Proveedor eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.loadSuppliers();
      },
      error: (err) => {
        console.error('Error al eliminar proveedor', err);
        this.snackBar.open('Error al eliminar proveedor', 'Cerrar', { duration: 3000 });
      }
    });
  }

}

