import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../services/client'; // ajusta si la ruta es distinta
import { Admin } from '../../services/admin';

import { Auth } from '../../services/auth';  // Ajusta la ruta
import { CreateComentarioDto } from '../../interfaces/CreateComentarioDto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.html',
  styleUrl: './questions.css'
})
export class Questions implements OnInit {
  preguntasConRespuestas: any[] = [];
  idChickenCoop: string = '';
  messageText: string = '';
  mensajeError: string = '';

  constructor(
    private productClient: Client, 
    private productAdmin: Admin,
    private authService: Auth  // <-- Aquí inyectamos Auth
  ) {}

  ngOnInit(): void {
    this.productClient.getPreguntasConRespuestas2().subscribe({
      next: (data) => {
        this.preguntasConRespuestas = data;
        console.log('Preguntas con respuestas:', data);
      },
      error: (err) => {
        console.error('Error al cargar preguntas con respuestas:', err);
      }
    });

    this.productAdmin.getAllBasic().subscribe(products => {
      if (products.length > 0) {
        const firstProduct = products[0];
        this.idChickenCoop = firstProduct.idChickenCoop;
      }
    });
  }

  sendMessage() {
    const userDetail = this.authService.getUserDetail();
    if (!userDetail) {
      this.mensajeError = 'Debe iniciar sesión para enviar un mensaje.';
      return;
    }
    if (!this.messageText.trim()) {
      this.mensajeError = 'El mensaje no puede estar vacío.';
      return;
    }

  const dto: CreateComentarioDto = {
  Text: this.messageText,
  ClientId: userDetail.id,
  ChickenCoopId: this.idChickenCoop,
  TypeMessage: 0
};


    this.productAdmin.createMessage(dto).subscribe({
      next: res => {
        console.log('Mensaje creado:', res);
        this.messageText = '';
        this.mensajeError = '';
        // Opcional: recargar preguntas y respuestas para ver el nuevo mensaje
        this.productClient.getPreguntasConRespuestas2().subscribe(data => {
          this.preguntasConRespuestas = data;
        });
      },
      error: err => {
        console.error('Error al crear mensaje:', err);
        this.mensajeError = 'Error al enviar mensaje.';
      }
    });
  }
}

