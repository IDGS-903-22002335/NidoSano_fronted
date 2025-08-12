import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChickenCoopWithRecipesDto } from '../../interfaces/ChickenCoopWithRecipesDto';
import { Admin } from '../../services/admin';
import { ProductionLotCreateDto } from '../../interfaces/ProductionLotCreateDto';
import { ProductionDto } from '../../interfaces/ProductionDto';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterLink,
    MatSnackBarModule 
  ],
  templateUrl: './production.html',
  styleUrl: './production.css'
})
export class Production implements OnInit {
  chickenCoops: ChickenCoopWithRecipesDto[] = [];
  selectedRecipeId: string = '';
  cantidad: number = 1;
  mostrarModal: boolean = false;
  productions: ProductionDto[] = [];

  constructor(private adminService: Admin, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.adminService.getChickenCoopsWithRecipes().subscribe({
      next: (res) => {
        this.chickenCoops = res;
      },
      error: (err) => {
        console.error('Error al cargar chicken coops:', err);
        this.snackBar.open('Error al cargar los gallineros.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'] 
        });
      }
    });

    this.adminService.getProduction().subscribe({
      next: (res) => {
        this.productions = Array.isArray(res) ? res : [res];
      },
      error: (err) => {
        console.error('Error al cargar la producción:', err);
        this.snackBar.open('Error al cargar datos de producción.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
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
        this.snackBar.open('Producción registrada correctamente.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'] 
        });
        this.selectedRecipeId = '';
        this.cantidad = 1;
      },
      error: (err) => {
        console.error('Error al registrar producción:', err);
        this.snackBar.open('Error al registrar producción.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
