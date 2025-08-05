import { Component, OnInit } from '@angular/core';
import { Client } from '../../services/client';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-buys-client',
  imports: [CommonModule, RouterModule],
  templateUrl: './buys-client.html',
  styleUrl: './buys-client.css'
})
export class BuysClient  implements OnInit {
  purchasedProducts: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private clientService: Client) {}

  ngOnInit(): void {
    this.loadPurchasedProducts();
  }

  loadPurchasedProducts() {
    this.loading = true;
    this.clientService.getPurchasedProducts().subscribe({
      next: (products) => {
        this.purchasedProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando productos comprados:', error);
        this.errorMessage = 'Error al cargar las compras';
        this.loading = false;
      }
    });
  }

  getTypeLabel(type: number): string {
  const typeLabels = ['Pendiente', 'Cancelado', 'Atendida', 'Enviado', 'Entregado'];
  return typeLabels[type] ?? 'Desconocido';
}

}