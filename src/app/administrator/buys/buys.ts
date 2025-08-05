import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';
import { Auth } from '../../services/auth';
import { component } from '../../interfaces/component';
import { SupplierDto } from '../../interfaces/Supplier';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BuysCreateDto } from '../../interfaces/BuysCreate';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BuysDetailDto } from '../../interfaces/BuysDetail';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-buys',
  templateUrl: './buys.html',
  styleUrls: ['./buys.css'],
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    DatePipe,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule
  ],
})
export class Buys implements OnInit {
  suppliers: SupplierDto[] = [];
  components: component[] = [];
  selectedSupplierId: string = '';
  selectedComponentId: string = '';
  unitPrice: number = 0;
  amount: number = 0;
  showModal: boolean = false;
  buys: BuysDetailDto[] = [];
  componentLots: BuysCreateDto["componentLots"] = [];
  searchText: string = '';
searchDate: string = '';

dateFilter = new Date();

constructor(
    private adminService: Admin,
    private authService: Auth,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadComponents();
    this.listBuys();
  }

  listBuys() {
    this.adminService.getAllBuysWithDetails().subscribe({
      next: (data) => {
        this.buys = data.sort((a, b) => 
          new Date(b.dateBuys).getTime() - new Date(a.dateBuys).getTime()
        );
      },
      error: (err) => console.error('Error al cargar compras:', err)
    });
  }


loadSuppliers() {
  this.adminService.getSupplier().subscribe({
    next: (data) => {
      console.log('Proveedores:', data);
      this.suppliers = data;
    },
    error: (err) => console.error('Error al obtener proveedores', err)
  });
}

loadComponents() {
  this.adminService.getComponent().subscribe({
    next: (data) => {
      console.log('Componentes:', data);
      this.components = data;
    },
    error: (err) => console.error('Error al obtener componentes', err)
  });
}

registerBuy() {
  const admin = this.authService.getUserDetail();
  if (!admin || !admin.id) {
    this.snackBar.open('No se encontró el administrador autenticado.', 'Cerrar', { duration: 3000 });
    return;
  }

  if (this.componentLots.length === 0) {
    this.snackBar.open('Debes agregar al menos un producto al carrito.', 'Cerrar', { duration: 3000 });
    return;
  }

  const compra: BuysCreateDto = {
    adminId: admin.id,
    componentLots: [...this.componentLots]
  };

  this.adminService.BuysRegister(compra).subscribe({
    next: () => {
      this.snackBar.open('Compra registrada correctamente', 'Cerrar', { duration: 3000 });
      this.resetForm();
      this.componentLots = [];
      this.showModal = false;
      this.listBuys();
    },
    error: (err) => {
      console.error('Error al registrar compra:', err);
      this.snackBar.open('Error al registrar la compra.', 'Cerrar', { duration: 3000 });
    }
  });
}


addToCart() {
  if (!this.selectedSupplierId || !this.selectedComponentId || this.unitPrice <= 0 || this.amount <= 0) {
    this.snackBar.open('Por favor completa todos los campos válidos.', 'Cerrar', { duration: 3000 });
    return;
  }

  const component = this.components.find(c => c.idComponent === this.selectedComponentId);
  const supplier = this.suppliers.find(s => s.idSupplier === this.selectedSupplierId);

  if (!component || !supplier) return;

  this.componentLots.push({
    componentId: this.selectedComponentId,
    supplierId: this.selectedSupplierId,
    unitPrice: this.unitPrice,
    amount: this.amount,
 
  });

  this.resetForm();
}


  resetForm() {
    this.selectedSupplierId = '';
    this.selectedComponentId = '';
    this.unitPrice = 0;
    this.amount = 0;
  }

  // Métodos  para el carrito
getComponentName(componentId: string): string {
  const component = this.components.find(c => c.idComponent === componentId);
  return component ? component.name : 'Desconocido';
}

getSupplierName(supplierId: string): string {
  const supplier = this.suppliers.find(s => s.idSupplier === supplierId);
  return supplier ? supplier.name : 'Desconocido';
}

getTotal(): number {
  return this.componentLots.reduce((sum, item) => sum + (item.unitPrice * item.amount), 0);
}

removeFromCart(index: number): void {
  this.componentLots.splice(index, 1);
  this.snackBar.open('Producto eliminado del carrito', 'Cerrar', { duration: 2000 });
}

formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

get filteredBuys(): BuysDetailDto[] {
  return this.buys.filter(buy => {
    const searchTextLower = this.searchText.toLowerCase();
    
    const textMatch = this.searchText ? 
      buy.componentLots.some(lot => {
        const componentName = lot.componentName?.toLowerCase() || '';
        const supplierName = lot.supplierName?.toLowerCase() || '';
        return componentName.includes(searchTextLower) || 
               supplierName.includes(searchTextLower);
      }) : true;
    
    const dateMatch = this.searchDate ? 
      this.formatDate(new Date(buy.dateBuys)) === this.formatDate(new Date(this.searchDate)) : true;
    
    return textMatch && dateMatch;
  });
}

clearFilters(): void {
  this.searchText = '';
  this.searchDate = '';
  this.snackBar.open('Filtros limpiados', 'Cerrar', { duration: 2000 });
}
}
