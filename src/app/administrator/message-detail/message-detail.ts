import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Admin } from '../../services/admin';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CreateComentarioDto } from '../../interfaces/CreateComentarioDto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-message-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './message-detail.html',
  styleUrls: ['./message-detail.css']
})
export class MessageDetail implements OnInit {
  mensaje: any = null;
  respuestaTexto: string = '';
  constructor(
  private route: ActivatedRoute,
  private adminService: Admin,
  private authService: Auth,
  private snackBar: MatSnackBar,
  private router: Router
) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.adminService.getPreguntasYComentariosPendientes().subscribe({
      next: (data) => {
        this.mensaje = data.find((m: any) => m.id === id);
      },
      error: (err) => {
        console.error('Error al cargar mensaje', err);
      }
    });
  }

  enviarRespuesta() {
  if (!this.respuestaTexto.trim()) {
    this.snackBar.open('Escribe una respuesta antes de enviar.', 'Cerrar', { duration: 3000 });
    return;
  }


  const admin = this.authService.getUserDetail();
  if (!admin || !admin.id) {
        this.snackBar.open('No se encontró información del administrador autenticado.', 'Cerrar', { duration: 3000 });

    return;
  }

 let typeMessageRespuesta: number;
if (this.mensaje?.typeMessage === 0) { // 1 = Pregunta
  typeMessageRespuesta = 1; // Respuesta
} else {
  typeMessageRespuesta = 2; // Comentario
}


  const dto: CreateComentarioDto = {
    Text: this.respuestaTexto,
    AdministratorId: admin.id,
    ChickenCoopId: this.mensaje?.chickenCoopId,
    ParentMessageId: this.mensaje?.id,
    TypeMessage: typeMessageRespuesta
  };

  this.adminService.createMessage(dto).subscribe({
    next: () => {
      this.snackBar.open('Respuesta enviada correctamente', 'Cerrar', { duration: 3000 });

      this.respuestaTexto = '';

      this.router.navigate(['/message']);
    },
    error: (err) => {
      console.error('Error al enviar respuesta:', err);
            this.snackBar.open('No se pudo enviar la respuesta.', 'Cerrar', { duration: 3000 });


    }
  });
}

}
