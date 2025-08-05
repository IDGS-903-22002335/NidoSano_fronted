import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';
import { constingDto } from '../../interfaces/Costing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-costing',
  templateUrl: './costing.html',
  styleUrl: './costing.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class Costing implements OnInit {
  costings: constingDto[] = [];
  componentName: string = ''; 

  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    this.componentName = 'ESP32 DEVKIT'; 
    this.getCostingsByComponentName(this.componentName);
  }

  getCostingsByComponentName(name: string): void {
    this.adminService.getCostingByName(name).subscribe({
      next: (data) => {
       
        this.costings = Array.isArray(data) ? data : [data]; 
      },
      error: (error) => {
        console.error('Error al obtener costings por nombre de componente:', error);
      }
    });
  }
}

