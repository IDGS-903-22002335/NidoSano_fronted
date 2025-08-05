import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Admin } from '../../services/admin'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateSaleStatusDto } from '../../interfaces/UpdateSaleStatusDto';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface ChickenCoopBasic {
  idChickenCoop: string;
  name: string;
}

@Component({
  selector: 'app-sales-details',
  templateUrl: './sales-details.html',
  styleUrls: ['./sales-details.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule,MatSnackBarModule],
})
export class SalesDetails implements OnInit {
  saleDetail: any;
  chickenCoops: ChickenCoopBasic[] = [];
  selectedChickenCoopId: string = '';
  saleId: string | null = null;

  constructor(
  private route: ActivatedRoute,
  private admin: Admin,
  private snackBar: MatSnackBar
) {}


  ngOnInit(): void {
    this.saleId = this.route.snapshot.paramMap.get('id');

    if (this.saleId) {
      this.admin.getSaleWithDetailsById(this.saleId).subscribe({
        next: (data) => {
          this.saleDetail = data;
        },
        error: (err) => {
          console.error('Error al obtener los detalles de la venta', err);
        }
      });
    }

    this.admin.getAllBasic().subscribe({
      next: (data) => {
        this.chickenCoops = data;
      },
      error: (err) => {
        console.error('Error al obtener gallineros básicos', err);
      }
    });
  }

  asignarChickenCoop() {
    if (!this.selectedChickenCoopId || !this.saleId) {
  this.snackBar.open('Seleccione un gallinero y asegúrese que el id de la venta esté disponible.', 'Cerrar', { duration: 3000 });
  return;
}


    const dto = {
      SaleId: this.saleId,
      ChickenCoopId: this.selectedChickenCoopId
    };

 this.admin.updateSaleWithChickenCoop(dto).subscribe({
  next: (res) => {
    this.snackBar.open(res.Mensaje, 'Cerrar', { duration: 3000 });
  },
  error: (err) => {
    this.snackBar.open('Error al actualizar la venta: ' + err.error, 'Cerrar', { duration: 3000 });
  }
});

  }

avanzarEstadoVenta() {
if (!this.saleId || this.saleDetail?.type === undefined || this.saleDetail?.type === null) {
  this.snackBar.open('No se puede actualizar el estado de esta venta.', 'Cerrar', { duration: 3000 });
  return;
}


  const estadoActual = this.saleDetail.type;
  let nuevoEstado: number | null = null;

  if (estadoActual === 2) {
    nuevoEstado = 3; // De Atendido a Enviado
  } else if (estadoActual === 3) {
    nuevoEstado = 4; // De Enviado a Entregado
  }  else if (estadoActual === 1 || estadoActual === 4) {
  this.snackBar.open('La venta ya fue cancelada o entregada.', 'Cerrar', { duration: 3000 });
  return;
} else {
  this.snackBar.open('El estado actual no permite avanzar.', 'Cerrar', { duration: 3000 });
  return;
}


  const dto: UpdateSaleStatusDto = {
    saleId: this.saleId,
    newStatus: nuevoEstado
  };

  this.admin.changeSaleStatus(dto).subscribe({
    next: () => {
  this.snackBar.open(`Estado actualizado a ${this.obtenerNombreEstado(nuevoEstado!)}.`, 'Cerrar', { duration: 3000 });
  this.admin.getSaleWithDetailsById(this.saleId!).subscribe({
    next: (data) => (this.saleDetail = data)
  });
},
error: (err) => {
  this.snackBar.open('Error al cambiar el estado: ' + err.error, 'Cerrar', { duration: 3000 });
}

  });
}


  obtenerNombreEstado(status: number): string {
  switch (status) {
    case 0: return 'Pendiente';
    case 1: return 'Cancelado';
    case 2: return  'Atendido';
    case 3: return 'Enviado';
    case 4: return 'Entregado';
    default: return 'Desconocido';
  }
}

getTotalAmount(sale: any): number {
  if (!sale.saleDetails || sale.saleDetails.length === 0) {
    return 0;
  }
  return sale.saleDetails.reduce((sum: number, detail: any) => sum + detail.amount, 0);
}

}
