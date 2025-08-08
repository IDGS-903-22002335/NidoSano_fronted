import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css'
})
export class Sales implements OnInit {
  salesWithDetails: any[] = [];
  filteredSales: any[] = [];
  searchName: string = '';
  searchDate: string = '';
  
  private searchSubject = new Subject<void>();

  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    this.adminService.getSalesWithDetails().subscribe({
      next: (data) => {
        this.salesWithDetails = data;
        this.filteredSales = [...data];
      },
      error: (err) => {
        console.error('Error al obtener ventas con detalles:', err);
      }
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filterSales();
    });
  }

  onSearchChange(): void {
    this.searchSubject.next();
  }

  filterSales(): void {
    this.filteredSales = this.salesWithDetails.filter(sale => {
      const nameMatch = this.searchName 
        ? sale.clienteNombre?.toLowerCase().includes(this.searchName.toLowerCase()) 
        : true;
      
      const dateMatch = this.searchDate 
        ? new Date(sale.registrationDate).toISOString().split('T')[0] === this.searchDate
        : true;
      
      return nameMatch && dateMatch;
    });
  }

  getStatusText(status: number): string {
    switch(status) {
      case 0: return 'Pendiente';
      case 1: return 'Cancelado';
      case 2: return 'Atendido';
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