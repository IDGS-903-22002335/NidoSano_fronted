import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Admin } from '../../services/admin';
import { UpdateUserDto } from '../../interfaces/UpdateUserDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {
  authService = inject(Auth);
  adminService = inject(Admin);
  editableUser: UpdateUserDto | null = null;
snackBar = inject(MatSnackBar);

  accountDetail$ = this.authService.getDetail();

  ngOnInit() {
  this.accountDetail$.subscribe(user => {
    if (user) {
      this.editableUser = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        lastName: user.lastName || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        phoneNumber: user.phoneNumber || ''
      };
    }
  });
}


  updateUserData(user: UpdateUserDto) {
    this.adminService.updateUser(user).subscribe({
      next: () => {
      this.snackBar.open('Datos actualizados correctamente', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['bg-green-600', 'text-white'] // opcional: usa clases Tailwind si estás usando Tailwind
      });
    },
    error: (err) => console.error('Error al actualizar:', err)
  });
    
  }
}
