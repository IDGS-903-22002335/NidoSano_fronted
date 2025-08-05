import { Component } from '@angular/core';
import { Client } from '../../services/client';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-estimate',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon, MatSnackBarModule],
  templateUrl: './estimate.html',
  styleUrl: './estimate.css'
})
export class Estimate {
  estimateDto = {
    clientId: '',
    chickenCoopLocation: '',
    quantityChickens: 0,
    environmentalMonitoring: '',
    airQualityMonitoring: '',
    naturalLightingMonitoring: '',
    automaticFeedDispenser: '',
    waterLevelGauge: '',
    nightMotionSensor: '',
    connectionType: '',
    physicalInstallation: ''
  };

  totalCotizacion: number | null = null;
  idEstimate: string | null = null;       
  cantidadVenta: number | null = null;    
  mostrarVenta: boolean = false;         

  constructor(private clientService: Client, private auth: Auth,
      private snackBar: MatSnackBar

  ) {}

  generarCotizacion() {
    const user = this.auth.getUserDetail();
    if (!user) {
this.snackBar.open('Debes iniciar sesión para generar una cotización.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    return;      
    }

    this.estimateDto.clientId = user.id;

    this.clientService.generateEstimate(this.estimateDto).subscribe({
      next: (res) => {
        console.log('Cotización generada:', res);
        this.totalCotizacion = res.precioTotal;
        this.idEstimate = res.idEstimate;  
        this.mostrarVenta = true;   
         this.snackBar.open('Cotización generada exitosamente.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });      
      },
      error: (err) => {
        console.error('Error generando cotización:', err);
        this.snackBar.open('Ocurrió un error al generar la cotización.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      }
    });
  }

  registrarVenta() {
    if (!this.idEstimate) {
      this.snackBar.open('No hay una estimación válida para registrar la Compra.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (!this.cantidadVenta || this.cantidadVenta <= 0) {
       this.snackBar.open('Ingresa una cantidad válida para la compra.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    const dto = {
      estimateId: this.idEstimate,
      cantidadProductos: this.cantidadVenta
    };

    this.clientService.registerSaleFromEstimate(dto).subscribe({
      next: (res) => {
        console.log('Venta registrada:', res);
     
        this.snackBar.open('Compra registrada exitosamente.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });    
        this.mostrarVenta = false;
        this.cantidadVenta = null;
        this.idEstimate = null;
        this.totalCotizacion = null;
      },
      error: (err) => {
        console.error('Error registrando venta:', err);
        alert('Ocurrió un error al registrar la venta.');
      }
    });
  }
}

