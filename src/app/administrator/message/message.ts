import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin } from '../../services/admin';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './message.html',
  styleUrls: ['./message.css']
})
export class Message implements OnInit {

  mensajes: any[] = [];

  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    this.adminService.getPreguntasYComentariosPendientes().subscribe({
      next: (data) => {
        this.mensajes = data;
      },
      error: (error) => {
        console.error('Error cargando mensajes:', error);
      }
    });
  }
}
