import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth';
import { Admin } from '../../services/admin';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UserDetailDtoID } from '../../interfaces/UserDetailId';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UpdateUserDto } from '../../interfaces/UpdateUserDto';


@Component({
  selector: 'app-update-client',
  standalone: true,
  imports: [CommonModule, FormsModule,MatInputModule,
    ReactiveFormsModule, 
    MatIconModule,
    MatSnackBarModule,
    AsyncPipe,
    CommonModule],
  templateUrl: './update-client.html',
  styleUrl: './update-client.css'
})
export class UpdateClient implements OnInit {
  authService = inject(Auth);
  adminService = inject(Admin);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);

  userDetailID?: UserDetailDtoID;

  
  saveChanges() {
  if (!this.userDetailID) return;

  const updatedUser: UpdateUserDto = {
    id: this.userDetailID.id,
    email: this.userDetailID.email,
    fullName: this.userDetailID.fullName,
    lastName: this.userDetailID.lastName,
    address: this.userDetailID.address,
    city: this.userDetailID.city,
    state: this.userDetailID.state,
    phoneNumber: this.userDetailID.phoneNumber
  };

  this.adminService.updateUser(updatedUser).subscribe({
    next: () => {
      this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
    },
    error: (err) => {
      console.error('Error al actualizar:', err);
      this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 3000 });
    }
  });
}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.adminService.getUserDetailById(id).subscribe({
        next: (user) => {
          this.userDetailID = user;
          console.log('Detalle de usuario:', user);
        },
        error: (err) => {
          console.error('Error al cargar detalle del usuario:', err);
          this.snackBar.open('Error al cargar el cliente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
