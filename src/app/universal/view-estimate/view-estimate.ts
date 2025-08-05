import { Component, inject } from '@angular/core';
import { Client } from '../../services/client'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-estimate',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './view-estimate.html',
  styleUrl: './view-estimate.css'
})
export class ViewEstimate {

  
   snackBar = inject(MatSnackBar);


  formData = {
    environmentalMonitoring: '',
    airQualityMonitoring: '',
    naturalLightingMonitoring: '',
    automaticFeedDispenser: '',
    waterLevelGauge: '',
    nightMotionSensor: '',
    quantityChickens: 0,
    physicalInstallation: '',
    connectionType: '',
    chickenCoopLocation: ''
  };

  precioTotal: number | null = null;

  constructor(private clientService: Client) {}

  generarVistaPrevia() {
    this.clientService.previewEstimate(this.formData).subscribe({
      next: (res) => {
        this.precioTotal = res?.precioTotal;
        console.log('Vista previa recibida:', res);
      },
      error: (err) => {
        console.error('Error al generar vista previa:', err);
      
              this.snackBar.open('Ocurrió un error al obtener la vista previa.', 'Cerrar', { duration: 3000 });

      }
    });
  }

  nuevoCliente = {
  name: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  city: '',
  state: ''
};

registrarClientePosible(form: any) {
  if (form.invalid) {
    return;
  }

  this.clientService.createPossibleClient(this.nuevoCliente).subscribe({
    next: (res) => {
      console.log('Cliente posible registrado:', res);
      this.snackBar.open('¡Gracias! Tu información ha sido registrada.', 'Cerrar', { duration: 3000 });

      form.resetForm(); // limpia el formulario
    },
    error: (err) => {
      console.error('Error al registrar cliente:', err);
            this.snackBar.open('Ocurrió un error al registrar tus datos.', 'Cerrar', { duration: 3000 });

    }
  });
}

}
