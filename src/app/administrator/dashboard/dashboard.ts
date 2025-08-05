import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Admin } from '../../services/admin';
import { TopSellingProduct } from '../../interfaces/dashboard';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule,RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  startDate!: string; // yyyy-MM-dd
  endDate!: string;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ventas',
        backgroundColor: '#42A5F5'
      }
    ]
  };

  public barChartType: 'bar' = 'bar';

  constructor(private adminService: Admin) {}

 

  consultar(): void {
  let start = this.startDate ? new Date(this.startDate) : new Date(new Date().getFullYear(), 0, 1); // 1 de enero actual
  let end = this.endDate ? new Date(this.endDate) : new Date(); // hoy

  this.adminService.getDashboard(start, end).subscribe({
    next: (data: any[]) => {
const labels = data.map(p => `${p.productName} (${p.totalRevenue})`);

      const quantities = data.map(p => p.quantitySold);

      this.barChartData = {
        labels,
        datasets: [
          {
            data: quantities,
            label: 'Ventas por día',
            backgroundColor: '#34D399'
          }
        ]
      };
    },
    error: (err) => {
      console.error('Error al obtener datos del dashboard:', err);
    }
  });
}

ngOnInit(): void {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1); // 1 de enero

  // Formatear las fechas como yyyy-MM-dd para que aparezcan en el input
  this.startDate = startOfYear.toISOString().split('T')[0];
  this.endDate = today.toISOString().split('T')[0];

  this.consultar(); // Ejecutar de inmediato
}


}