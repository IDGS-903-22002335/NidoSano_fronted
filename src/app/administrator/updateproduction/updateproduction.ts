import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin'; 
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-updateproduction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './updateproduction.html',
  styleUrl: './updateproduction.css'
})
export class Updateproduction implements OnInit {
  requestedProducts: any[] = [];
  errorMessage: string = ''; // mensaje de error

  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    this.loadRequestedProducts();
  }

  loadRequestedProducts() {
    this.adminService.getAllProductRequested().subscribe({
      next: (res) => {
        this.requestedProducts = res;
        this.errorMessage = ''; // limpia el error si hay datos nuevos
        console.log('Productos solicitados:', this.requestedProducts);
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar productos solicitados.';
        console.error('Error al cargar productos solicitados:', err);
      }
    });
  }

  changeLotStatus(lotId: string, newStatus: string): void {
    this.adminService.changeProductionStatus(lotId, newStatus).subscribe({
      next: () => {
        console.log(`Lote ${lotId} actualizado a ${newStatus}`);
        this.errorMessage = ''; // limpia el mensaje si todo sale bien
        this.loadRequestedProducts();
      },
      error: (err) => {
        this.errorMessage = err?.error || 'Error al cambiar estado del lote.';
        console.error(`Error al cambiar estado del lote ${lotId}:`, err);
      }
    });
  }
}

