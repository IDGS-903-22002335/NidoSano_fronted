import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from '../../services/client';
import { CommonModule } from '@angular/common';
import { Admin } from '../../services/admin';


@Component({
  selector: 'app-buys-clientdetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buys-clientdetail.html',
  styleUrl: './buys-clientdetail.css'
})
export class BuysClientdetail implements OnInit {
  products: any[] = [];
  loading = false;
  errorMessage = '';
saleId: string = '';

constructor(
  private route: ActivatedRoute,
  private clientService: Client,
  private adminService: Admin 
) {}

cancelSale() {
  const dto = {
    saleId: this.saleId,      
    newStatus: 1
  };

  console.log('DTO a enviar:', dto); 

  this.adminService.changeSaleStatus(dto).subscribe({
    next: (res) => {
      console.log('Venta cancelada:', res);
      alert(res.mensaje);
    },
    error: (err) => {
      console.error('Error cancelando venta:', err);
      alert(err.error || 'Error al cancelar la venta.');
    }
  });
}




 
  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('saleId');
  if (id) {
    this.saleId = id; 
    this.loading = true;
    this.clientService.getPurchasedProductsByID(id).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalles:', err);
        this.errorMessage = 'Error al cargar los detalles de la compra.';
        this.loading = false;
      }
    });
  } else {
    this.errorMessage = 'ID de compra no proporcionado.';
  }
}


  getTypeLabel(type: number): string {
    const typeLabels = ['Pendiente', 'Cancelado', 'Atendida', 'Enviado', 'Entregado'];
    return typeLabels[type] ?? 'Desconocido';
  }

  getStatusColor(type: number): string {
    const colors = ['bg-yellow-100 text-yellow-800', 'bg-red-100 text-red-800', 'bg-blue-100 text-blue-800', 'bg-purple-100 text-purple-800', 'bg-emerald-100 text-emerald-800'];
    return colors[type] ?? 'bg-gray-100 text-gray-800';
  }

  getProgressWidth(type: number): string {
    const widths = ['20%', '0%', '40%', '80%', '100%'];
    return widths[type] ?? '0%';
  }

  getStatusIcon(type: number): string {
    const icons = [
      'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', 
      'M6 18L18 6M6 6l12 12', 
      'M5 13l4 4L19 7', 
      'M8 7l4-4 4 4m0 6l-4 4-4-4', 
      'M5 13l4 4L19 7' 
    ];
    return icons[type] ?? 'M13 10V3L4 14h7v7l9-11h-7z'; 
  }
}