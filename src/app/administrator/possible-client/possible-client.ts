import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin'; 
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-possible-client',
  imports: [CommonModule, MatIconModule, FormsModule, RouterLink],
  templateUrl: './possible-client.html',
  styleUrl: './possible-client.css'
})
export class PossibleClient implements OnInit {
  
  possibleClients: any[] = [];

  constructor(private adminService: Admin) {}

  ngOnInit() {
    this.cargarPossibleClients();
  }

  cargarPossibleClients() {
    this.adminService.getPossibleClient().subscribe({
      next: (res) => {
        this.possibleClients = res;
        console.log('Clientes posibles cargados:', this.possibleClients);
      },
      error: (err) => {
        console.error('Error al cargar clientes posibles:', err);
      }
    });
  }
}