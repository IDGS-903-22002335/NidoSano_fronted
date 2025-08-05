import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin'; // Ajusta según tu proyecto
import { Auth } from '../../services/auth';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Client } from '../../services/client';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './product-view.html',
  styleUrls: ['./product-view.css']
})
export class ProductView implements OnInit {
resumenCalificaciones: any = null;

  idChickenCoop: string = '';
  name: string = '';
  description: string = '';
  price: number = 0;
  hoveredStar: number = 0;
preguntasConRespuestas: any[] = [];

  punctuation: number = 0;  
  messageText: string = ''; // Texto que el usuario escribe
  mensajeError: string = ''; // Mensaje de error para mostrar si no está autenticado
parentMessageId?: string = undefined;

  constructor(private productService: Admin, private userAuth: Auth, private productClient: Client) {}

  ngOnInit(): void {
    this.productService.getAllBasic().subscribe(products => {
      if (products.length > 0) {
        const firstProduct = products[0];
        this.idChickenCoop = firstProduct.idChickenCoop;
        this.name = firstProduct.name;
        this.description = firstProduct.description;
        this.price = firstProduct.price;

        this.cargarPreguntasConRespuestas();
        this.cargarResumenCalificaciones();
      }
    });
  }

  

sendMessage() {
  console.log('sendMessage() llamado');

  const userDetail = this.userAuth.getUserDetail();
  if (!userDetail) {
    this.mensajeError = 'Debe iniciar sesión para enviar un mensaje.';
    return;
  } else {
    this.mensajeError = '';
  }

  const dto: any = {
    Text: this.messageText,
    ClientId: userDetail.id,
    ChickenCoopId: this.idChickenCoop,
    TypeMessage: 2  // O el tipo que corresponda (Pregunta, Comentario, etc.)
  };

  // Si parentMessageId tiene valor, lo agregamos para indicar que es respuesta
  if (this.parentMessageId) {
    dto.ParentMessageId = this.parentMessageId;
  }

  this.productService.createMessage(dto).subscribe({
    next: res => {
      console.log('Mensaje enviado:', res);
      this.messageText = '';
      this.parentMessageId = undefined;  // Limpias el id de respuesta tras enviar
      this.cargarPreguntasConRespuestas(); // refresca la lista si quieres
    },
    error: err => {
      console.error('Error al enviar mensaje', err);
    }
  });
}


  sendQualification() {
    const userDetail = this.userAuth.getUserDetail();
    if (!userDetail) {
      this.mensajeError = 'Debe iniciar sesión para enviar una calificación.';
      return;
    }
    if (this.punctuation < 1 || this.punctuation > 5) {
      this.mensajeError = 'La puntuación debe ser entre 1 y 5.';
      return;
    }

    const dto = {
      ClientId: userDetail.id,
      ChickenCoopId: this.idChickenCoop,
      Punctuation: this.punctuation
    };

    this.productClient.createQualification(dto).subscribe({
      next: res => {
        console.log('Calificación enviada:', res);
        this.mensajeError = '';
        this.punctuation = 0; // Limpiar puntuación si quieres
      },
      error: err => {
        console.error('Error al enviar calificación', err);
        this.mensajeError = 'Error al enviar calificación.';
      }
    });
  }

  cargarPreguntasConRespuestas() {
  this.productClient.getPreguntasConRespuestas().subscribe({
    next: (data) => {
      this.preguntasConRespuestas = data;
      console.log('Preguntas con respuestas:', this.preguntasConRespuestas);
    },
    error: (err) => {
      console.error('Error al cargar preguntas con respuestas', err);
    }
  });
}

cargarResumenCalificaciones() {
  this.productClient.getResumenCalificaciones(this.idChickenCoop).subscribe({
    next: (data) => {
      this.resumenCalificaciones = data;
      console.log('Resumen calificaciones:', data);
    },
    error: (err) => {
      console.error('Error al obtener resumen de calificaciones', err);
    }
  });
}
}
