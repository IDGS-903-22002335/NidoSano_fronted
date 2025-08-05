import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChickenCoopWithRecipesDto } from '../../interfaces/ChickenCoopWithRecipesDto';
import { Admin } from '../../services/admin';
import { ProductionLotCreateDto } from '../../interfaces/ProductionLotCreateDto'; // Asegúrate de importar correctamente
import { ProductionDto } from '../../interfaces/ProductionDto'; // Ajusta la ruta si es necesario
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
  templateUrl: './production.html',
  styleUrl: './production.css'
})
export class Production implements OnInit {
  chickenCoops: ChickenCoopWithRecipesDto[] = [];
  selectedRecipeId: string = '';
  cantidad: number = 1;
mostrarModal: boolean = false;
productions: ProductionDto[] = [];

  constructor(private adminService: Admin) {}

 ngOnInit(): void {
  this.adminService.getChickenCoopsWithRecipes().subscribe({
    next: (res) => {
      this.chickenCoops = res;
    },
    error: (err) => {
      console.error('Error al cargar chicken coops:', err);
    }
  });

  this.adminService.getProduction().subscribe({
    next: (res) => {
      this.productions = Array.isArray(res) ? res : [res]; // por si tu backend devuelve solo un objeto
    },
    error: (err) => {
      console.error('Error al cargar la producción:', err);
    }
  });
}


  registrarProduccion() {
    const lotes: ProductionLotCreateDto[] = [];

    const fecha = new Date().toISOString();

    for (let i = 0; i < this.cantidad; i++) {
      lotes.push({
        recipeId: this.selectedRecipeId,
        dateProduction: fecha
      });
    }

    this.adminService.registerMultipleProductionLots(lotes).subscribe({
      next: () => {
        alert('Producción registrada correctamente');
        this.selectedRecipeId = '';
        this.cantidad = 1;
      },
      error: (err) => {
        console.error('Error al registrar producción:', err);
        alert('Error al registrar producción');
      }
    });
  }
}
